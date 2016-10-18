import React from 'react';
import axios from 'axios';

const path = 'http://127.0.0.1:3000';

export default class Articles extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      url: '',
      description: '',
      articles: [],
      pages: [[]],
      errors: [],
      articlePage: 0
    }
  }

  componentDidMount() {
    this.getArticles();
  }

  handleChange() {
    this.setState({
      url: document.getElementById('article-url').value,
      description: document.getElementById('article-description').value
    });
  }

  getArticles() {
    const context = this;
    axios.get('/articles/all', data => {
      return data;
    }).then(function(data) {
      context.setState({
        articles: data.data.reverse()
      })
    }).then(() => {
      this.getPages();
    })
  }

  getPages() {
    const context = this;
    let results = [];
    context.state.articles.reduce((memo, item, i) => {
      memo.push(item);
      if ( (i + 1) % 10 === 0 || i === context.state.articles.length - 1 ) {
        results.push(memo);
        memo = [];
      }
      return memo;
    }, []);
    context.setState({
      pages: results
    })
  }

  changeArticlePage(page) {
    this.setState({
      articlePage: page
    })
  }

  uploadArticle() {
    let req = {
      url: this.state.url,
      description: this.state.description
    }
    if (!sessionStorage.getItem('user_email')) {
      window.location = `${path}/login`;
    }

    if ( req.url && req.description ) {
      if ( req.url.substring(0, 4) === 'http') {
        axios.post('/articles/create', req, data => {
        }).then(this.getArticles.bind(this));

        document.getElementById('article-url').value = '';
        document.getElementById('article-description').value = '';

        this.setState({
          errors: [],
          url: '',
          description: ''
        })
      } else {
        this.setState({
          errors: [{ text: 'Please use valid url' }]
        })
      }
    } else {
      this.setState({
        errors: [{ text: 'Please fill out all fields' }]
      })
    }
  }

  thumbs(status, url) {
    let email = sessionStorage.getItem('user_email')
    if (email) {
      let firstRequest = {
        status: status,
        url: url
      }

      axios.post('/user/getUser', { email: email }, data => {
        return data.data
      }).then(data => {
        let foundLink = false;
        data.data.votes.forEach(link => {
          if (link === url) {
            foundLink = true;
          }
        })
        if (!foundLink) {
          let secondRequest = {
            email: email,
            update: data.data.votes.concat(url)
          }
          axios.post('/user/updateVotes', secondRequest, (data) => {
          }).then(() => {
            axios.post('/articles/thumbs', firstRequest, data => {
            }).then(() => {
              this.getArticles();
            })
          })
        } else {
          console.log('didnt work')
        }
      })
    } else {
      window.location = `${path}/login`;
    }
  }

  myFunction() {
    document.getElementById("myArticleDropdown").classList.toggle("show");
  }

  render() {
    return (
      <div className="container">
        <div> {
          this.state.errors.map(error => {
            return ( <div className="error"> { error.text } </div> )
          })
        } </div>
        <div className="row dropdown dropelem">
          <button onClick={this.myFunction.bind(this) } className="dropbtn dropelem">Submit Article</button>
          <div id="myArticleDropdown" className="dropdown-content dropelem text-md-center">
          <div className="col-md-12 upload dropelem">
            <input onChange={ this.handleChange.bind(this) }
                   id="article-url"
                   type="text"
                   className="dropelem"
                   placeholder="Article Url">
            </input>
          </div>
          <div className="col-md-12 upload dropelem">
            <input onChange={ this.handleChange.bind(this) }
                   id="article-description"
                   type="text"
                   className="dropelem"
                   placeholder="Description">
            </input>
          </div>
          <div className="col-md-12 upload dropelem">
            <button onClick={ this.uploadArticle.bind(this) }>Upload</button>
          </div>
          </div>
        </div>
        <h3>Articles</h3>
        <div> {
          this.state.pages[this.state.articlePage].map(article => {
            return(
              <div className="col-md-12">
                <div className="row">
                  <a href={ article.url }><h4>{ article.url }</h4></a>
                  <p>{ article.description }</p>
                  <p onClick={ this.thumbs.bind(this, 'up', article.url) }>^</p>
                  <p>{ article.thumbs }</p>
                  <p onClick={ this.thumbs.bind(this, 'down', article.url) }>v</p>
                </div>
              </div>
            )
          })
        } </div>
        <div className="col-md-12"> {
          this.state.pages.map((item, i) => {
            return (
              <button className="article-pages"
                      onClick={ this.changeArticlePage.bind(this, i) }>{ i + 1 }
              </button>
            )
          })
        } </div>
      </div>
    )
  }
}