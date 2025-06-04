from flask import request
from flask_restx import Namespace, Resource, fields

from dao.countryDao import CountryDAO

country_dao = CountryDAO()

MAX_COUNTRY_ID = country_dao.max_id()

ns = Namespace('nationality', description='Nationality related operations')

country_model = ns.model('Country', {
    'id': fields.Integer(readOnly=True, description='The unique identifier of a user'),
    'name': fields.String(required=True, description='User first name'),
    'iso3166_numeric': fields.Integer(readOnly=True, description='The unique identifier of a user'),
    'alpha2': fields.String(required=True, description='User first name'),
})

@ns.route('/')
class Nationalities(Resource):
    @ns.doc('get_all_countries')
    @ns.marshal_with(country_model)
    def get(self):
        """Get all countries"""
        return country_dao.get_all()
