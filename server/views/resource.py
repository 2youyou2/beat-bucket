from flask import Blueprint, current_app, g, jsonify, request
from jwt import ExpiredSignatureError, InvalidTokenError
from server.db import insert_project, get_project_id, insert_track, get_all_projects, get_project
from server.views.auth import get_db
from server.auth import decode_auth_token


resource_bp = Blueprint('resource_bp', __name__)


def get_token(headers):
    '''Gets the auth token from the headers if it exists'''
    auth_header = headers.get('Authorization')
    if auth_header:
        return auth_header.split(' ')[1]
    return ''


@resource_bp.route('/projects', methods=['GET'])
def projects_get():
    '''Gets all projects for a given user'''
    auth_token = get_token(request.headers)
    if not auth_token:
        return jsonify({'error': 'Forbidden: no authentication provided'}), 403

    user_id = decode_auth_token(auth_token, current_app.config['SECRET_KEY'])

    if user_id is None:
        return jsonify({'error': 'Invalid token'}), 403

    db_conn = get_db(current_app)
    cursor = db_conn.cursor()
    projects = get_all_projects(cursor, user_id)
    cursor.close()
    db_conn.close()
    return jsonify({'message': 'Success', 'projects': projects}), 200


@resource_bp.route('/project/<int:project_id>')
def project_get(project_id):
    '''Gets a project from the database'''
    auth_token = get_token(request.headers)
    if not auth_token:
        return jsonify({'error': 'Forbidden: no authentication provided'}), 403

    user_id = decode_auth_token(auth_token, current_app.config['SECRET_KEY'])

    if user_id is None:
        return jsonify({'error': 'Invalid token'}), 403

    db_conn = get_db(current_app)
    project = get_project(db_conn, project_id)
    db_conn.close()

    if project['user_id'] != user_id:
        return jsonify({'error': 'Forbidden: project belongs to another user'}), 403

    return jsonify({'message': 'Success', 'project': project}), 200


@resource_bp.route('/save', methods=['POST'])
def save_project():
    '''Saves a brand new project'''
    auth_token = get_token(request.headers)
    if not auth_token:
        return jsonify({'error': 'Forbidden: no authentication provided'}), 403

    json_data = request.get_json()

    user_id = decode_auth_token(auth_token, current_app.config['SECRET_KEY'])
    if user_id is None:
        return jsonify({'error': 'Invalid token'}), 403

    json_data['user_id'] = user_id

    tracks = json_data['tracks']
    del json_data['tracks']

    db_conn = get_db(current_app)
    cursor = db_conn.cursor()

    # return error if that user already has a project with that name
    if get_project_id(cursor, user_id, json_data['name']):
        return jsonify({'error': 'A project with that name already exists'}), 400

    insert_project(cursor, json_data)
    db_conn.commit()

    project_id = get_project_id(cursor, json_data['user_id'], json_data['name'])

    for track in tracks.values():
        track['project_id'] = project_id
        insert_track(cursor, track)

    db_conn.commit()
    cursor.close()
    db_conn.close()

    return jsonify({
        'message': 'Project saved successfully',
        'project_id': project_id
    }), 201
