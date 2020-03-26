import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FaAngleRight, FaAngleLeft } from 'react-icons/fa';
import api from '../../services/api';

import { Loading, Owner, IssuesList } from './styles';
import Container from '../../components/Container/index';

export default class Repository extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        repository: PropTypes.string,
      }),
    }).isRequired,
  };

  state = {
    repository: {},
    issues: [],
    loading: true,
    filterType: 'all',
    pageNumber: 1,
    disablePrevious: true,
  };

  async componentDidMount() {
    await this.fetchData();
  }

  async componentDidUpdate(_, prevState) {
    const { filterType, pageNumber } = this.state;
    if (
      prevState.filterType !== filterType ||
      prevState.pageNumber !== pageNumber
    ) {
      await this.fetchData();
    }
  }

  handleFilter = e => {
    this.setState({
      filterType: e.target.value,
    });
  };

  prevPage = e => {
    const { pageNumber } = this.state;
    let currPageNumber = 1;

    if (pageNumber === 1) {
      currPageNumber = 1;
    } else {
      currPageNumber = pageNumber - 1;
    }

    this.setState({
      pageNumber: currPageNumber,
      disablePrevious: true,
    });
  };

  nextPage = e => {
    const { pageNumber } = this.state;
    let currPageNumber = 1;

    currPageNumber = pageNumber + 1;

    this.setState({
      pageNumber: currPageNumber,
      disablePrevious: false,
    });
  };

  async fetchData() {
    const { match } = this.props;

    const { filterType, pageNumber } = this.state;

    const repoName = decodeURIComponent(match.params.repository);

    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          state: filterType,
          per_page: 5,
          page: pageNumber,
        },
      }),
    ]);

    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false,
    });
  }

  render() {
    const { repository, issues, loading, disablePrevious } = this.state;

    if (loading) {
      return <Loading>Carregando</Loading>;
    }

    return (
      <Container>
        <Owner>
          <Link to="/">Voltar aos repositórios</Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>
        <IssuesList>
          <p>Filtrar por:</p>
          <button type="button" value="open" onClick={this.handleFilter}>
            Abertas
          </button>
          <button type="button" value="closed" onClick={this.handleFilter}>
            Fechadas
          </button>
          <button type="button" value="all" onClick={this.handleFilter}>
            Todas
          </button>
          <FaAngleLeft
            style={disablePrevious ? { opacity: '0.5' } : { opacity: '1' }}
            onClick={this.prevPage}
          />
          <FaAngleRight onClick={this.nextPage} />
          {issues.map(issue => (
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.login} />
              <div>
                <strong>
                  <a href={issue.html_url}>{issue.title}</a>
                  {issue.labels.map(label => (
                    <span key={String(label.id)}>{label.name}</span>
                  ))}
                </strong>
                <p>{issue.user.login}</p>
              </div>
            </li>
          ))}
        </IssuesList>
      </Container>
    );
  }
}
