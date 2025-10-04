from flask import Blueprint, request, jsonify
from .. import db
from ..models import Company

# Create a blueprint for company routes
companies_bp = Blueprint('companies', __name__, url_prefix='/api/companies')

@companies_bp.route('', methods=['GET'])
def get_companies():
    """Get all companies from the database"""
    try:
        companies = Company.query.all()
        return jsonify({
            "companies": [
                {
                    "id": str(company.id),
                    "name": company.name,
                    "country": company.country,
                    "currency_code": company.currency_code,
                    "created_at": company.created_at.isoformat()
                }
                for company in companies
            ]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@companies_bp.route('', methods=['POST'])
def create_company():
    """Create a new company"""
    try:
        data = request.get_json()
        company = Company(
            name=data['name'],
            country=data['country'],
            currency_code=data['currency_code']
        )
        db.session.add(company)
        db.session.commit()
        return jsonify({
            "message": "Company created successfully",
            "company": {
                "id": str(company.id),
                "name": company.name,
                "country": company.country,
                "currency_code": company.currency_code
            }
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
