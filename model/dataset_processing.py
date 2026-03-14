import pandas as pd

# Load dataset
df = pd.read_csv("Decision and Life Outcome Survey (Responses) - Form Responses 1.csv")

# Remove unnecessary column
df = df.drop(columns=["Timestamp"], errors="ignore")

# Clean text
df = df.dropna()
df = df.applymap(lambda x: x.strip() if isinstance(x, str) else x)

# FEATURE ENGINEERING

# 1️) Overthinking Level
overthink_map = {
    "Very often": 4,
    "Sometimes": 3,
    "Rarely": 2,
    "Almost never": 1
}

df["OverthinkingLevel"] = df[
    "How often do you feel overwhelmed by having too many choices?  "
].map(overthink_map).fillna(2)


# 2️) Risk Tolerance
risk_map = {
    "I love taking risks": 4,
    "I’m okay with moderate risks": 3,
    "It depends on the situation": 2,
    "I prefer to play it safe": 1
}

df["RiskTolerance"] = df[
    "How comfortable are you taking risks when making decisions?  "
].map(risk_map).fillna(2)


# 3️) Frustration Score
df["FrustrationScore"] = df[
    "What frustrates you most while making an important decision?  "
].apply(lambda x: len(str(x).split(",")))


# DECISION RISK CALCULATION

df["RiskScore_raw"] = (
    df["OverthinkingLevel"] * 0.3 +
    df["RiskTolerance"] * 0.3 +
    df["FrustrationScore"] * 0.4
)

df["RiskScore"] = 100 * (df["RiskScore_raw"] - df["RiskScore_raw"].min()) / (
    df["RiskScore_raw"].max() - df["RiskScore_raw"].min()
)

def categorize_risk(score):
    if score < 35:
        return "Low"
    elif score < 65:
        return "Moderate"
    else:
        return "High"

df["RiskCategory"] = df["RiskScore"].apply(categorize_risk)

#  Decision Stress (from overthinking question)
stress_map = {
    "Very often": 4,
    "Sometimes": 3,
    "Rarely": 2,
    "Almost never": 1
}

df["DecisionStress"] = df[
    "How often do you feel overwhelmed by having too many choices?  "
].map(stress_map).fillna(2)


# Decision Satisfaction (example mapping)
satisfaction_map = {
    "Very satisfied": 5,
    "Satisfied": 4,
    "Neutral": 3,
    "Dissatisfied": 2,
    "Very dissatisfied": 1
}

if "How satisfied are you with the decisions you usually make?" in df.columns:
    df["DecisionSatisfaction"] = df[
        "How satisfied are you with the decisions you usually make?"
    ].map(satisfaction_map).fillna(3)


df.to_csv("turningpoint_extended_dataset.csv", index=False)

print("Extended dataset created successfully")
df.head()
