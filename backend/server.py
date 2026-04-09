from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/")
def home():
    return "Turning Point AI Decision System Running"


@app.route("/analyze", methods=["POST"])
def analyze():
    
    user_data = request.json

    risk = user_data.get("risk_level")
    research = user_data.get("research_level")
    influence = user_data.get("influence")

    # Simple decision logic
    score = 0

    if risk >= 4:
        score += 2

    if research <= 2:
        score += 2

    if influence != "Self":
        score += 1

    if score >= 4:
        result = "High Risk Decision"
    elif score >= 2:
        result = "Medium Risk Decision"
    else:
        result = "Low Risk Decision"

    return jsonify({"decision_risk": result})


if __name__ == "__main__":
    app.run(debug=True)
