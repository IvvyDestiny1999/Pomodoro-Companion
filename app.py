from flask import Flask, render_template, request, redirect, url_for
from models import db, Task

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/tasks', methods=['GET', 'POST'])
def tasks():
    if request.method == 'POST':
        title = request.form.get('title')
        if title:
            new_task = Task(title=title, done=False)
            db.session.add(new_task)
            db.session.commit()
    tasks = Task.query.all()
    return render_template('tasks.html', tasks=tasks)

@app.route('/done/<int:id>')
def done_task(id):
    task = Task.query.get(id)
    task.done = True
    db.session.commit()
    return redirect(url_for('tasks'))

@app.route('/delete/<int:id>')
def delete_task(id):
    task = Task.query.get(id)
    db.session.delete(task)
    db.session.commit()
    return redirect(url_for('tasks'))

@app.route('/stats')
def stats():
    return render_template('stats.html')

@app.route('/logs')
def logs():
    return render_template('logs.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
