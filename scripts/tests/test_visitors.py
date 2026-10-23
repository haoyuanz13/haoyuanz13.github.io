import importlib.util
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location('update_visitors', Path(__file__).parents[1] / 'update-visitors.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


def country(code, name, count):
    return f'<tr><td>1.</td><td><a href="https://en.wikipedia.org/wiki/Flag_of_{name}"><img src="flag.png"></a></td><td><a href="https://en.wikipedia.org/wiki/{name}"><u>{name}</u></a></td><td>{count}</td><td><a href=/detail30/{code}/GMWI>chart</a></td></tr>'


def region(folder, code, name, count):
    return f'<tr><td></td><td>1.1.</td><td><img src=https://cdn.boardhost.com/{folder}/{code}.png></td><td>{name}</td><td>{count}</td><td>Today</td></tr>'


class VisitorParserTests(unittest.TestCase):
    locations = {'countries': {'us': {'longitude': -98, 'latitude': 39}, 'hk': {'longitude': 114, 'latitude': 22}, 'ca': {'longitude': -106, 'latitude': 57}}, 'regions': {'us-ca': {'longitude': -119, 'latitude': 37}, 'ca-ab': {'longitude': -115, 'latitude': 54}}}

    def test_country_names_skip_flag_images_and_keep_hong_kong(self):
        countries, _, _ = module.parse(country('us', 'United States', 10) + country('hk', 'Hong Kong', 2), self.locations)
        self.assertEqual([(r['name'], r['visitors']) for r in countries], [('United States', 10), ('Hong Kong', 2)])

    def test_region_counts_and_unlocated_visitors(self):
        source = country('us', 'United States', 10) + region('states', 'ca', 'California', 7) + country('ca', 'Canada', 3) + region('canada', 'ab', 'Alberta', 3)
        countries, regions, unresolved = module.parse(source, self.locations)
        self.assertEqual(sum(r['visitors'] for r in countries), 13)
        self.assertEqual([r['country'] for r in regions], ['United States', 'Canada'])
        self.assertEqual(unresolved, [{'country': 'United States', 'visitors': 3}])

    def test_incomplete_or_error_pages_do_not_replace_data(self):
        for source in ['<html>Service unavailable</html>', '<p>Countries 1 - 2 of 2.</p>' + country('us', 'United States', 10)]:
            with self.assertRaises(ValueError): module.parse(source, self.locations)

    def test_inconsistent_region_totals_are_rejected(self):
        with self.assertRaises(ValueError):
            module.parse(country('us', 'United States', 2) + region('states', 'ca', 'California', 3), self.locations)


if __name__ == '__main__':
    unittest.main()
