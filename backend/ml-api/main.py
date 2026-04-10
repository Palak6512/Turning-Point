from fastapi import FastAPI
import pickle
import numpy as np

app = FastAPI()

# Load models
stress_model = pickle.load(open("stress_model.pkl", "rb"))
risk_model = pickle.load(open("risk_model.pkl", "rb"))
trust_model = pickle.load(open("trust_model.pkl", "rb"))


# Explanation
def generate_explanation(overthinking, risk, frustration, stress, risk_score, trust, decision_type):
    text = ""

    if decision_type in ["Career", "Finance"]:
        text += "This is a high-impact decision. "

    if overthinking >= 3:
        text += "You tend to overthink, increasing stress. "
    else:
        text += "You are clear in decision-making. "

    if risk >= 3:
        text += "You are comfortable with risks. "
    else:
        text += "You prefer safer options. "

    if stress > 3:
        text += "You may feel stressed. "
    else:
        text += "You are likely calm. "

    if trust >= 3:
        text += "You trust AI suggestions."
    else:
        text += "You may not fully trust AI."

    return text


# Recommendation
def generate_recommendation(stress, risk, trust, decision_type):
    advice = ""

    if decision_type in ["Career", "Finance"]:
        advice += "Take time to evaluate options carefully. "

    if stress > 3:
        advice += "Break the decision into smaller steps. "
    else:
        advice += "You can approach this calmly. "

    if risk < 2:
        advice += "Stick to safe options. "
    elif risk < 3:
        advice += "Choose balanced options. "
    else:
        advice += "You can explore bold choices. "

    if trust <= 2:
        advice += "Use AI as support but trust yourself."
    else:
        advice += "You can rely on AI insights."

    return advice


@app.post("/predict")
def predict(data: dict):

    # Input from frontend
    overthinking = data["overthinking"]
    risk_input = data["risk"]
    frustration = data["frustration"]
    decision_type = data["decision_type"]
    importance = data["importance"]
    time_pressure = data["time_pressure"]

    # Adjusted values
    adjusted_overthinking = overthinking + (importance * 0.2)
    adjusted_frustration = frustration + (time_pressure * 0.3)

    model_input = np.array([[
        adjusted_overthinking,
        risk_input,
        adjusted_frustration
    ]])

    # Predictions
    stress = stress_model.predict(model_input)[0]
    risk = risk_model.predict(model_input)[0]
    trust = trust_model.predict(model_input)[0]

    explanation = generate_explanation(
        overthinking, risk_input, frustration, stress, risk, trust, decision_type
    )

    recommendation = generate_recommendation(
        stress, risk, trust, decision_type
    )

    # Graph data
    factors = [
        {"name": "Stress", "value": float(stress * 20)},
        {"name": "Risk", "value": float(risk * 20)},
        {"name": "Confidence", "value": float(trust * 25)},
        {"name": "Clarity", "value": float(100 - stress * 20)}
    ]

    return {
        "recommendation": recommendation,
        "explanation": explanation,
        "factors": factors
    }