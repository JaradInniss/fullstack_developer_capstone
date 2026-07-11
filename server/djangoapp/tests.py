import json
from unittest.mock import patch

from django.test import RequestFactory, SimpleTestCase

from .views import get_dealer_reviews


class DealerReviewsViewTests(SimpleTestCase):
    def setUp(self):
        self.factory = RequestFactory()

    @patch("djangoapp.views.analyze_review_sentiments")
    @patch("djangoapp.views.get_request")
    def test_returns_neutral_sentiment_when_analyzer_returns_none(
        self,
        mock_get_request,
        mock_analyze_review_sentiments,
    ):
        mock_get_request.return_value = [{"review": "Great experience"}]
        mock_analyze_review_sentiments.return_value = None

        request = self.factory.get("/djangoapp/reviews/dealer/29")
        response = get_dealer_reviews(request, dealer_id=29)

        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertEqual(data["reviews"][0]["sentiment"], "neutral")
