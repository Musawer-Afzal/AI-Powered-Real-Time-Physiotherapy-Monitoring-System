from app.core.database import SessionLocal
from app.models.exercise import Exercise

db = SessionLocal()

db.query(Exercise).delete()

exercises = [

    Exercise(
        code="shoulder-pendulum",
        name="Shoulder Pendulum",
        body_region="Upper Body",
        movement_type="Pendulum",
        difficulty="Beginner"
    ),

    Exercise(
        code="shoulder-flexion",
        name="Shoulder Flexion",
        body_region="Upper Body",
        movement_type="Flexion",
        difficulty="Beginner"
    ),

    Exercise(
        code="shoulder-abduction",
        name="Shoulder Abduction",
        body_region="Upper Body",
        movement_type="Abduction",
        difficulty="Beginner"
    ),

    Exercise(
        code="elbow-flexion",
        name="Elbow Flexion",
        body_region="Upper Body",
        movement_type="Flexion",
        difficulty="Beginner"
    ),

    Exercise(
        code="pelvic-tilt",
        name="Pelvic Tilt",
        body_region="Core",
        movement_type="Tilt",
        difficulty="Beginner"
    ),

    Exercise(
        code="bridge",
        name="Bridge",
        body_region="Core",
        movement_type="Extension",
        difficulty="Beginner"
    ),

    Exercise(
        code="straight-leg-raise",
        name="Straight Leg Raise",
        body_region="Lower Body",
        movement_type="Raise",
        difficulty="Beginner"
    ),

    Exercise(
        code="hip-abduction",
        name="Hip Abduction",
        body_region="Lower Body",
        movement_type="Abduction",
        difficulty="Beginner"
    ),

    Exercise(
        code="knee-flexion",
        name="Knee Flexion",
        body_region="Lower Body",
        movement_type="Flexion",
        difficulty="Beginner"
    ),

]

db.add_all(exercises)

db.commit()

db.close()

print("Exercises seeded successfully.")