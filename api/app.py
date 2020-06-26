from flask import Flask, jsonify, request
from flask_restful import Api, Resource
from pymongo import MongoClient
from bson.objectid import ObjectId
from flask_cors import CORS
import datetime

app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
api = Api(app)

client = MongoClient("mongodb://my_db:27017") #mongodb://my_db:27017
db = client.projectDB
articles = db["Articles"]

"""
HELPER FUNCTIONS
"""
def buildResponseError(**args):
    response = jsonify({
        "status": args["statusCode"],
        "service": args["service"],
        "args": args["args"],
        "error": args["error"]
    })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response 

def buildResponseSuccess(**args):
    response = jsonify({
        "status": args["statusCode"],
        "service": args["service"],
        "args": args["args"],
        "data": args["data"]
    })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response 

def buildArticleObjectToShow(item):
    return {
        "id": str(item.get('_id')),
        "picture": item.get('picture'),
        "description": item.get('description'),
        "order": item.get('order'),
        "creation_date": item.get('creation_date')
    }

def buildArticleObjectToSave(**args):
    return {
        "picture": args['picture'],
        "description": args['description'],
        "order": args['order'],
        "creation_date": args['creation_date']
    }    
    
"""
RESOURCES
"""
class Article(Resource):
    
    def get(self):
        
        try:
            result = articles.find({}).sort("order")
            objects = []
            for item in result:
                objects.append(
                    buildArticleObjectToShow(item)
                )
            
            return buildResponseSuccess(
                statusCode=200,
                service="GET: articles",
                args=request.args,
                data=objects
            )
            
        except (Exception) as error:
            return buildResponseError(
                statusCode=400,
                service="GET: articles",
                args=request.args,
                error=str(error)
            )
        
    def post(self):
        try:
            data = request.get_json()
            picture = data["picture"]
            description = data["description"]
            order = data["order"]
            
            if not picture:
                raise Exception("Field picture is required")
            
            if not description:
                raise Exception("Field description is required")
            
            if not order:
                order = articles.count_documents({}) + 1
            
            item = buildArticleObjectToSave(
                picture=picture,
                description=description,
                order=order,
                creation_date=datetime.datetime.utcnow()
            )

            id = articles.insert_one(item).inserted_id
            
            return buildResponseSuccess(
                statusCode=200,
                service="POST: articles",
                args=request.get_json(),
                data={'id':str(id)}
            )
            
        except (Exception) as error:
            return buildResponseError(
                statusCode=400,
                service="POST: articles",
                args=request.args,
                error=str(error)
            )
            
        
    def put(self):
        try:    
            data = request.get_json()
            
            id = data["id"]
            picture = data['picture']
            description = data['description']
            
            if not id:
                raise Exception("Field id is required")
            
            if not picture:
                raise Exception("Field picture is required")
            
            if not description:
                raise Exception("Field description is required")
            
            articles.update_one({
                "_id": ObjectId(id)
            }, {
                "$set": {
                    "picture": picture,
                    "description": description
                }
            })
  
            return buildResponseSuccess(
                statusCode=201,
                service="PUT: articles",
                args=request.get_json(),
                data=[]
            )
            
        except (Exception) as error:
            return buildResponseError(
                statusCode=400,
                service="PUT: articles",
                args=request.args,
                error=str(error)
            )
        
    def delete(self):
        try:
            
            data = request.get_json()
            id = data["id"]
            
            if not id:
                raise Exception("Field id is required")
            
            articles.delete_one({"_id": ObjectId(id)})
            
            return buildResponseSuccess(
                statusCode=201,
                service="DELETE: articles",
                args=request.get_json(),
                data=[]
            )
            
        except (Exception) as error:
            return buildResponseError(
                statusCode=400,
                service="DELETE: articles",
                args=request.args,
                error=str(error)
            )
        
class ArticleSort(Resource):
    def put(self):
        try:
            data = request.get_json()
            
            ids = data["ids"]
            
            if not ids:
                raise Exception("Field id is required")

            for index, id in enumerate(ids, start=1):
                articles.update_one({
                    "_id": ObjectId(id)
                }, {
                    "$set": {
                        "order": index
                    }
                })
            
            return buildResponseSuccess(
                statusCode=201,
                service="PUT: articles/sort",
                args=request.get_json(),
                data=[]
            )
            
        except (Exception) as error:
            return buildResponseError(
                statusCode=400,
                service="PUT: articles/sort",
                args=request.args,
                error=str(error)
            )
            
    
    
class Hello(Resource):
    def get(self):
        response = jsonify("Hello World!")
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
       
 
api.add_resource(Hello, '/api/hello')
api.add_resource(ArticleSort, '/api/articles/sort')
api.add_resource(Article, '/api/articles')

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)
        