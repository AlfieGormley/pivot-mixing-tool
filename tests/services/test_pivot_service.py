import pytest
from app.services import pivot_service

def test_integer_bpm_values():
    ratio, pivot = pivot_service.calculate_pivot_bpm(120, 130)
    assert isinstance(ratio, str)
    assert isinstance(pivot, float)
    assert pivot > 0

def test_float_bpms():
    ratio, pivot = pivot_service.calculate_pivot_bpm(127.5, 150.3)
    assert isinstance(ratio, str)
    assert isinstance(pivot, float)
    assert pivot > 0

def test_integer_and_float_bpm():
    ratio, pivot = pivot_service.calculate_pivot_bpm(128, 135.5)
    assert isinstance(ratio, str)
    assert isinstance(pivot, float)
    assert pivot > 0

def test_equal_bpms():
    ratio, pivot = pivot_service.calculate_pivot_bpm(128, 128)
    assert ratio == "1:1"
    assert pivot == 128.0

def test_pivot_does_not_exceed_origin():
    ratio, pivot = pivot_service.calculate_pivot_bpm(120, 160)
    assert pivot < 120  

def test_max_denominator_limits_ratio_for_valid_bpm_range():
    for origin in range(110, 180, 5): 
        for dest in range(110, 180, 5):
            ratio, _ = pivot_service.calculate_fundamental_pivot_bpm(origin, dest)
            nums = [int(x) for x in ratio.split(":")]
            assert nums[1] <= 16

def test_octave_is_power_of_two_multiple_of_fundamental():
    origin = 150
    dest = 165
    ratio, fundamental = pivot_service.calculate_fundamental_pivot_bpm(origin, dest)
    octave = pivot_service.calculate_best_pivot_octave(origin, fundamental)
    while octave > fundamental:
        octave /= 2
    assert octave == fundamental  

