"""Regression checks for the authorship boundary used by personal news."""
import importlib.util
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location("build_pubs", Path(__file__).with_name("build-pubs.py"))
build_pubs = importlib.util.module_from_spec(spec)
spec.loader.exec_module(build_pubs)


class AuthorRoleValidation(unittest.TestCase):
    def validate(self, roles, author_ids=None):
        paper = {"author_ids": author_ids or ["member"], "author_roles": roles}
        return build_pubs.validate_author_roles(paper, {"member", "other"})

    def test_verified_dual_role_is_allowed(self):
        self.assertEqual(self.validate({"member": ["co_first", "co_corresponding"]}), [])

    def test_missing_roles_does_not_infer_eligibility(self):
        self.assertEqual(build_pubs.validate_author_roles({"author_ids": ["member"]}, {"member"}), [])

    def test_non_authors_and_unknown_members_are_rejected(self):
        self.assertTrue(self.validate({"other": ["co_first"]}))
        self.assertTrue(self.validate({"outsider": ["corresponding"]}, ["outsider"]))

    def test_invalid_or_empty_role_arrays_are_rejected(self):
        for roles in [None, [], "co_first", ["coauthor"], [{}], ["co_first", "co_first"]]:
            with self.subTest(roles=roles):
                self.assertTrue(self.validate({"member": roles}))
        self.assertTrue(self.validate([]))

    def test_conflicting_sole_and_shared_roles_are_rejected(self):
        self.assertTrue(self.validate({"member": ["first", "co_first"]}))
        self.assertTrue(self.validate({"member": ["corresponding", "co_corresponding"]}))


class JournalMetricValidation(unittest.TestCase):
    def setUp(self):
        self.paper = {"type": "journal", "venue": "Example Journal, 2026", "tags": []}
        self.metric = {"value": 5.6, "year": 2025, "source": "https://example.org/metrics"}

    def tag(self, metric=None, paper=None):
        return build_pubs.journal_metric_tag(paper or self.paper, {"Example Journal": metric or self.metric})

    def test_publication_year_does_not_replace_jif_year(self):
        tag = self.tag()
        self.assertEqual(tag["label"], "IF 5.6 (2025)")
        self.assertEqual(tag["source"], self.metric["source"])

    def test_conferences_and_preprints_receive_no_journal_metric(self):
        for kind in ["conference", "preprint", "other"]:
            self.assertIsNone(build_pubs.journal_metric_tag({"type": kind, "venue": "Unknown"}, {}))

    def test_an_unknown_journal_cannot_silently_omit_if(self):
        with self.assertRaisesRegex(ValueError, "journal-metrics"):
            build_pubs.journal_metric_tag(self.paper, {})

    def test_invalid_metric_data_is_rejected(self):
        for patch in [{"value": -1}, {"value": "5.6"}, {"value": True}, {"value": float("nan")},
                      {"year": 2026.5}, {"year": True}, {"source": "javascript:alert(1)"}]:
            with self.subTest(patch=patch), self.assertRaises(ValueError):
                self.tag({**self.metric, **patch})

    def test_unknown_metric_year_must_be_explicit(self):
        with self.assertRaises(ValueError):
            self.tag({**self.metric, "year": None})
        tag = self.tag({**self.metric, "year": None, "year_note": "Publisher does not identify the statistical year."})
        self.assertEqual(tag["label"], "IF 5.6")
        self.assertIn("statistical year", tag["year_note"])

    def test_chinese_if_is_distinct_and_keeps_its_precision(self):
        tag = self.tag({**self.metric, "value": 1.122, "metric": "chinese_if"})
        self.assertEqual(tag["label"], "Chinese IF 1.122 (2025 ed.)")
        self.assertEqual(tag["label_cn"], "中文 IF 1.122（2025版）")

    def test_legacy_per_paper_if_cannot_override_the_journal_source(self):
        with self.assertRaisesRegex(ValueError, "per-paper IF"):
            self.tag(paper={**self.paper, "tags": [{"kind": "if", "label": "IF 99"}]})


if __name__ == "__main__":
    unittest.main()
