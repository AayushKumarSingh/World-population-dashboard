import pandas as pd
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load the population data
pop_df = pd.read_csv("./world_population_data.csv")
top10pop = pop_df[["country", "2023 population"]].nlargest(10, "2023 population")

# Load the religion data
rel_df = pd.read_csv("./rounded_population.csv")
rel_df = rel_df.query("Year == 2020 and Region == ' World'")
rel_df.drop(columns=["Year", "Region", "Country", "All Religions"], inplace=True)

@app.route("/data", methods=["GET"])
def get_data():
    # Prepare bar chart data
    bar_chart_data = top10pop.rename(columns={"2023 population": "population"}).to_dict(orient="records")

    # Prepare pie chart data
    pie_chart_data = [{"name": key, "value": int(value)} for key, value in rel_df.iloc[0].items()]

    # Combine data into a single response
    data = {
        "barChartData": bar_chart_data,
        "pieChartData": pie_chart_data,
        
    }
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)