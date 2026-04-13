
# STEP 1: IMPORT LIBRARIES
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier


# STEP 2: LOAD DATA
df = pd.read_csv("Decision and Life Outcome Survey (Responses) - Form Responses 1.csv")


# STEP 3: DATA CLEANING
df = df.drop(columns=["Timestamp"], errors="ignore")
df = df.dropna()

for col in df.select_dtypes(include="object"):
    df[col] = df[col].str.strip()

# STEP 4: FEATURE ENGINEERING

# Overthinking
overthink_map = {
    "Very often": 4,
    "Sometimes": 3,
    "Rarely": 2,
    "Almost never": 1
}

df["OverthinkingLevel"] = df[
    "How often do you feel overwhelmed by having too many choices?  "
].map(overthink_map).fillna(2)

# Risk Tolerance
risk_map = {
    "I love taking risks": 4,
    "I’m okay with moderate risks": 3,
    "It depends on the situation": 2,
    "I prefer to play it safe": 1
}

df["RiskTolerance"] = df[
    "How comfortable are you taking risks when making decisions?  "
].map(risk_map).fillna(2)

# Frustration Score
df["FrustrationScore"] = df[
    "What frustrates you most while making an important decision?  "
].apply(lambda x: len(str(x).split(",")))

# Trust Score
trust_map = {
    "Yes, completely": 4,
    "Yes, somewhat": 3,
    "Not sure": 2,
    "No": 1
}
df["AITrustScore"] = df[
    "Would you trust an AI system that explains its reasoning instead of just giving answers?  "
].map(trust_map).fillna(2)


# STEP 5: TARGET VARIABLES

df["StressLevel"] = (
    df["OverthinkingLevel"] * 0.5 +
    df["FrustrationScore"] * 0.5
)

df["RiskScore"] = (
    df["RiskTolerance"] * 0.6 +
    (5 - df["OverthinkingLevel"]) * 0.4
)


# STEP 6: MODEL TRAINING

X = df[["OverthinkingLevel", "RiskTolerance", "FrustrationScore"]]

X_train, X_test, y_stress_train, y_stress_test, y_risk_train, y_risk_test, y_trust_train, y_trust_test = train_test_split(
    X, df["StressLevel"], df["RiskScore"], df["AITrustScore"],
    test_size=0.2, random_state=42
)

stress_model = RandomForestRegressor()
stress_model.fit(X_train, y_stress_train)

risk_model = RandomForestRegressor()
risk_model.fit(X_train, y_risk_train)

trust_model = RandomForestClassifier()
trust_model.fit(X_train, y_trust_train)


# STEP 7: EXPLANATION FUNCTION

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


# STEP 8: RECOMMENDATION FUNCTION

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


# STEP 9: SIMULATED USER PROFILE

profile = {
    "overthinking": 3,
    "risk": 2,
    "frustration": 2,
    "ai_trust": 2
}


# STEP 10: DECISION INPUT

decision = {
    "decision_type": "Career",
    "importance": 4,
    "time_pressure": 3
}


# STEP 11: AI LOGIC (COMBINED)

adjusted_overthinking = profile["overthinking"] + (decision["importance"] * 0.2)
adjusted_frustration = profile["frustration"] + (decision["time_pressure"] * 0.3)

model_input = [[
    adjusted_overthinking,
    profile["risk"],
    adjusted_frustration
]]

# Predictions
stress = stress_model.predict(model_input)[0]
risk = risk_model.predict(model_input)[0]
trust = trust_model.predict(model_input)[0]


# STEP 12: FINAL OUTPUT

print("\n========== FINAL AI OUTPUT ==========\n")

print("Stress Level:", round(stress,2))
print("Risk Level:", round(risk,2))
print("Trust Level:", trust)

print("\n--- Insight ---\n")
print(generate_explanation(
    profile["overthinking"],
    profile["risk"],
    profile["frustration"],
    stress,
    risk,
    trust,
    decision["decision_type"]
))

print("\n--- Recommendation ---\n")
print(generate_recommendation(
    stress,
    risk,
    trust,
    decision["decision_type"]
))
