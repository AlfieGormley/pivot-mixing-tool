from fractions import Fraction



def calculate_fundamental_pivot_bpm(origin_bpm, destination_bpm, max_denominator = 16):

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
    fundamental_pivot_bpm = round(origin_bpm / i, 1)

    return ratio, fundamental_pivot_bpm

# An octave of a bpm is doubling or halfing the tempo (BPM)
def calculate_best_pivot_octave(origin_bpm, fundamental_pivot_bpm):

    octave = fundamental_pivot_bpm
    while octave * 2 <= origin_bpm:
        octave *= 2

    return octave

# Returns the most suitable octave of the fundamental pivot bpm
def calculate_pivot_bpm(origin_bpm, destination_bpm):

    ratio, fundamental_pivot_bpm = calculate_fundamental_pivot_bpm(origin_bpm, destination_bpm)
    octave = calculate_best_pivot_octave(origin_bpm, fundamental_pivot_bpm)
    pivot_bpm = octave

    return ratio, pivot_bpm

