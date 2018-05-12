import axios from "axios";

export default {

  getArticles: function() {
    return axios.get("/api/articles");
  },
  // Gets the book with the given id
  getBook: function(id) {
    return axios.get("/api/articles/" + id);
  },
  // Deletes the book with the given id
  deleteArticle: function(id) {
    return axios.delete("/api/articles/" + id);
  },

  //Saves a article to the database
  saveArticle: function(articleData) {
    return axios.post("/api/articles", articleData);
  },

  // //request data from nytimes
  // getArticles2: function(topic, begin, end) {
  //   axios({
  //     url:'https://api.nytimes.com/svc/search/v2/articlesearch.json',
  //     params:{ 'api-key': "7ca74794a0a64d579de04b287793ce32",
  //           'q': topic,
  //           'begin_date': begin,
  //           'end_date': end}
  //   })
  //     .then(function(response) {
  //     console.log(response);
  //   });
  // }

};
