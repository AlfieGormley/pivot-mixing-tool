from fractions import Fraction

def calculate_pivot_bpm(origin_bpm, destination_bpm, max_denominator = 16):

    # Basic input validation
    if origin_bpm <= 0 or destination_bpm <= 0:
        raise ValueError("BPM values must be positive numbers")

    # Compute ratio of tempos
    ratio_value = origin_bpm / destination_bpm

    # Find the best integer approximation of the ratio
    frac = Fraction(ratio_value).limit_denominator(max_denominator)

    i = frac.numerator
    j = frac.denominator

    ratio = f"{i}:{j}"

    # Fundamental pivot BPM
    pivot_bpm = round(origin_bpm / i, 1)

    return ratio, pivot_bpm