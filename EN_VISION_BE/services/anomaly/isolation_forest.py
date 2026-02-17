import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sqlalchemy import text
from db.session import engine


def run_isolation_forest():
    """
    ML-based anomaly detection using Isolation Forest
    """

    # 1️⃣ Load data
    query = """
        SELECT
            date,
            department_id,
            device_id,
            total_kwh,
            avg_kwh,
            peak_kwh
        FROM daily_energy_summary
    """
    df = pd.read_sql(query, engine)

    if df.empty:
        return

    # 2️⃣ Feature engineering
    df["date"] = pd.to_datetime(df["date"])
    df["day_of_week"] = df["date"].dt.dayofweek
    df["month"] = df["date"].dt.month

    features = df[
        ["total_kwh", "avg_kwh", "peak_kwh", "day_of_week", "month"]
    ]

    # 3️⃣ Train Isolation Forest
    model = IsolationForest(
        n_estimators=100,
        contamination=0.05,   # 5% anomalies
        random_state=42
    )

    df["anomaly_score"] = model.fit_predict(features)

    # Convert output
    df["anomaly_label"] = df["anomaly_score"].apply(
        lambda x: "ANOMALY" if x == -1 else "NORMAL"
    )

    # 4️⃣ Persist results
    insert_query = text("""
        INSERT INTO energy_anomalies (
            date,
            department_id,
            device_id,
            total_kwh,
            anomaly_score,
            anomaly_label
        )
        VALUES (
            :date,
            :department_id,
            :device_id,
            :total_kwh,
            :anomaly_score,
            :anomaly_label
        )
    """)

    with engine.begin() as conn:
        conn.execute(text("DELETE FROM energy_anomalies;"))

        for _, row in df.iterrows():
            conn.execute(
                insert_query,
                {
                    "date": row["date"].date(),
                    "department_id": row["department_id"],
                    "device_id": row["device_id"],
                    "total_kwh": row["total_kwh"],
                    "anomaly_score": int(row["anomaly_score"]),
                    "anomaly_label": row["anomaly_label"]
                }
            )
