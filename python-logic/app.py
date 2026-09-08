from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os
from datetime import datetime

app = Flask(__name__)

# Allow the Angular frontend (a different origin) to call this service directly
allowed_origins = os.getenv('CORS_ALLOWED_ORIGINS', 'http://localhost:4200').split(',')
CORS(app, resources={r"/api/*": {"origins": allowed_origins}})

# Database Configuration
db_url = os.getenv('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/battery_inventory')
if db_url.startswith('postgres://'):
    db_url = db_url.replace('postgres://', 'postgresql://')

app.config['SQLALCHEMY_DATABASE_URI'] = db_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Simple models (for reference, actual tables in PostgreSQL)
class Battery(db.Model):
    __tablename__ = 'batteries'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    sku = db.Column(db.String(50), unique=True, nullable=False)
    price = db.Column(db.Numeric(10, 2), nullable=False)

class Inventory(db.Model):
    __tablename__ = 'inventory'
    id = db.Column(db.Integer, primary_key=True)
    battery_id = db.Column(db.Integer, nullable=False)
    region = db.Column(db.String(50), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow)

class Transaction(db.Model):
    __tablename__ = 'transactions'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    battery_id = db.Column(db.Integer, nullable=False)
    quantity_sold = db.Column(db.Integer, nullable=False)
    region = db.Column(db.String(50), nullable=False)
    transaction_type = db.Column(db.String(20), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

@app.route('/api/python/stock-alert', methods=['POST'])
def stock_alert():
    """Get low-stock batteries for a region"""
    data = request.json
    region = data.get('region', 'East')
    threshold = data.get('threshold', 20)

    low_stock = Inventory.query.filter(
        Inventory.region == region,
        Inventory.quantity < threshold
    ).all()

    result = [{
        'battery_id': item.battery_id,
        'quantity': item.quantity,
        'alert': 'CRITICAL' if item.quantity < 10 else 'WARNING'
    } for item in low_stock]

    return jsonify(result), 200

@app.route('/api/python/forecast', methods=['GET'])
def forecast_demand():
    """Predict stock needs based on recent sales"""
    battery_id = request.args.get('battery_id', type=int)
    days = request.args.get('days', 30, type=int)

    transactions = Transaction.query.filter(
        Transaction.battery_id == battery_id,
        Transaction.transaction_type == 'SALE'
    ).all()

    if len(transactions) < 3:
        return jsonify({'trend': 'insufficient_data'}), 200

    avg_daily_sales = len(transactions) / days if days > 0 else 0
    trend = 'declining' if avg_daily_sales > 2 else 'stable'

    return jsonify({
        'avg_daily_sales': round(avg_daily_sales, 2),
        'trend': trend,
        'restock_by': (datetime.now().date()).isoformat()
    }), 200

@app.route('/api/python/process-sale', methods=['POST'])
def process_sale():
    """Atomically process a sale (validation layer)"""
    data = request.json
    battery_id = data.get('batteryId')
    quantity = data.get('quantity')
    region = data.get('region')

    if not battery_id or not quantity or not region:
        return jsonify({'error': 'Missing required fields'}), 400

    if quantity <= 0:
        return jsonify({'error': 'Quantity must be positive'}), 400

    return jsonify({'success': True, 'message': 'Sale validation passed'}), 200

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'healthy'}), 200

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def server_error(error):
    return jsonify({'error': 'Server error'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
