import pandas as pd

# Load the dataset
data = pd.read_csv("../data/turningpoint_processed_dataset.csv")

print("Dataset Loaded Successfully")

# Show first few rows
print(data.head())


# Decision risk analysis logic
def decision_risk_analysis(risk_category, decision_stress, decision_satisfaction):

    score = 0

    # Risk category factor
    if risk_category == "High":
        score += 2
    elif risk_category == "Medium":
        score += 1

    # Stress factor
    if decision_stress >= 4:
        score += 2
    elif decision_stress >= 2:
        score += 1

    # Satisfaction factor
    if decision_satisfaction <= 2:
        score += 2
    elif decision_satisfaction <= 3:
        score += 1

    # Final decision classification
    if score >= 5:
        return "High Risk Decision"

    elif score >= 3:
        return "Medium Risk Decision"

    else:
        return "Low Risk Decision"


# Example prediction
result = decision_risk_analysis("High", 4, 2)

print("Decision Risk:", result)
