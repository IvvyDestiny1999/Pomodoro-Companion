from flask import Blueprint, render_template, request, redirect, url_for, jsonify, current_app
from app import db
from models import Task, Log

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    return render_template('index.html')

@main_bp.route('/dashboard')
def dashboard():
    tasks = Task.query.order_by(Task.created_at.desc()).all()
    return render_template('dashboard.html', tasks=tasks)

@main_bp.route('/logs')
def logs():
    logs = Log.query.order_by(Log.created_at.desc()).limit(200).all()
    return render_template('logs.html', logs=logs)

# API: CRUD tasks
@main_bp.route('/api/tasks', methods=['GET'])
def api_tasks():
    tasks = Task.query.order_by(Task.created_at.desc()).all()
    return jsonify([t.to_dict() for t in tasks])

@main_bp.route('/api/tasks', methods=['POST'])
def api_tasks_create():
    data = request.get_json() or {}
    title = data.get('title') or data.get('name')
    if not title:
        return jsonify({'error': 'title required'}), 400
    task = Task(title=title, description=data.get('description'))
    db.session.add(task)
    db.session.commit()
    return jsonify(task.to_dict()), 201

@main_bp.route('/api/tasks/<int:task_id>', methods=['PUT'])
def api_tasks_update(task_id):
    task = Task.query.get_or_404(task_id)
    data = request.get_json() or {}
    task.title = data.get('title', task.title)
    task.description = data.get('description', task.description)
    task.completed = bool(data.get('completed', task.completed))
    db.session.commit()
    return jsonify(task.to_dict())

@main_bp.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def api_tasks_delete(task_id):
    task = Task.query.get_or_404(task_id)
    db.session.delete(task)
    db.session.commit()
    return jsonify({'deleted': True})