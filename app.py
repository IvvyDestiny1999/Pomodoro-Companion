from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os

db = SQLAlchemy()

def create_app(test_config=None):
    app = Flask(__name__, static_folder='static', template_folder='templates')
    app.config.from_mapping(
        SECRET_KEY=os.environ.get('SECRET_KEY', 'dev-secret'),
        SQLALCHEMY_DATABASE_URI=os.environ.get('DATABASE_URL', 'sqlite:///pomodoro.db'),
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
    )

    if test_config:
        app.config.update(test_config)

    db.init_app(app)

    # Register blueprints if routes.py provides them
    try:
        from routes import main_bp
        app.register_blueprint(main_bp)
    except Exception as e:
        app.logger.warning(f"Could not register blueprint from routes.py: {e}")

    # Create DB tables
    with app.app_context():
        try:
            db.create_all()
        except Exception as e:
            app.logger.warning(f"DB create_all failed: {e}")

    return app

# For gunicorn: module: callable -> app:create_app()
app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), debug=True)