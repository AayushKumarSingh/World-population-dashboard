import pandas
from flask import Flask, jsonify
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

pop_df = pandas.read_csv("./world_population_data.csv")
top10pop = pop_df[["country", "2023 population"]].nlargest(10, "2023 population")
top10pop.set_index("country", inplace=True)

rel_df = pandas.read_csv("./rounded_population.csv")
rel_df = rel_df.query("Year == 2020 and Region == ' World'")
rel_df.drop(columns=["Year", "Region", "Country", "All Religions"], inplace=True)
rel_2022 = rel_df.to_dict()


@app.route("/population", methods=['GET'])
@cross_origin()
def getPopulation():
    return jsonify(top10pop.to_dict())


@app.route("/religion", methods=['GET'])
@cross_origin()
def getReligion():
    return jsonify({key: list(rel_2022[key].values())[-1] for key in rel_2022.keys()})

