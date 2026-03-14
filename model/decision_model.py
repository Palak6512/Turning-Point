import pandas as pd

# Load the dataset
data = pd.read_csv("../data/turningpoint_processed_dataset.csv")

print("Dataset Loaded Successfully")

# Show first few rows
print(data.head())


# Simple decision risk logic
def decision_risk_analysis(risk_level, research_level, influence):

    score = 0

    if risk_level >= 4:
        score += 2

    if research_level <= 2:
        score += 2

    if influence != "Self":
        score += 1

    if score >= 4:
        return "High Risk Decision"

    elif score >= 2:
        return "Medium Risk Decision"

    else:
        return "Low Risk Decision"


# Example prediction
result = decision_risk_analysis(4,1,"Friends")

print("Decision Risk:", result)
