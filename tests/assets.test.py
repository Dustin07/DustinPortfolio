import importlib.util
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location('version_assets', Path(__file__).resolve().parents[1] / 'tools/version_assets.py')
versioner = importlib.util.module_from_spec(spec)
spec.loader.exec_module(versioner)
hashes = {name: '123456789abc' for name in versioner.assets}

class AssetVersions(unittest.TestCase):
    def update(self, text):
        return versioner.versioned_html(text, hashes)

    def test_home_relative_path(self):
        self.assertEqual(self.update('href="styles.css?v=old"'), 'href="styles.css?v=123456789abc"')

    def test_case_relative_path(self):
        self.assertEqual(self.update('src="../figures.js?v=old"'), 'src="../figures.js?v=123456789abc"')

    def test_absolute_404_path(self):
        self.assertEqual(self.update('src="https://dustin07.github.io/DustinPortfolio/portfolio.js?v=old"'), 'src="https://dustin07.github.io/DustinPortfolio/portfolio.js?v=123456789abc"')

    def test_root_relative_path(self):
        self.assertEqual(self.update('href="/DustinPortfolio/styles.css"'), 'href="/DustinPortfolio/styles.css?v=123456789abc"')

    def test_unrelated_host_is_untouched(self):
        text='src="https://example.com/portfolio.js?v=other"'
        self.assertEqual(self.update(text),text)

    def test_original_documents_are_untouched(self):
        text='href="../documents/dustin-leung-resume.pdf?v=approved"'
        self.assertEqual(self.update(text),text)

    def test_non_version_parameters_are_preserved(self):
        self.assertEqual(self.update('src="ambient.js?v=old&amp;mode=quiet"'), 'src="ambient.js?v=123456789abc&amp;mode=quiet"')

    def test_duplicate_versions_are_replaced_once(self):
        self.assertEqual(self.update('src="portfolio.js?v=one&amp;v=two"'), 'src="portfolio.js?v=123456789abc"')

    def test_refresh_is_idempotent(self):
        first=self.update('href="styles.css?v=old"')
        self.assertEqual(self.update(first),first)

    def test_blank_parameters_remain_present(self):
        self.assertEqual(self.update('src="ambient.js?mode=&amp;v=old"'), 'src="ambient.js?v=123456789abc&amp;mode="')

if __name__ == '__main__':
    unittest.main(verbosity=2)
