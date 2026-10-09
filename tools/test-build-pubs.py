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


if __name__ == "__main__":
    unittest.main()
