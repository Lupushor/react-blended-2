import { Component } from 'react';

import { FiSearch } from 'react-icons/fi';
import { FormBtn, InputSearch, SearchFormStyled } from './SearchForm.styled';

export class SearchForm extends Component {
  state = {
    query: '',
  };

  handelInput = e => {
    this.setState({ query: e.currentTarget.value.toLowerCase().trim() });
  };

  handelSubmit = e => {
    e.preventDefault();
    const { query } = this.state;
    this.props.onSubmit(query);
    this.setState({ query: '' });
  };
  render() {
    const { query } = this.state;
    return (
      <SearchFormStyled onSubmit={this.handelSubmit}>
        <FormBtn type="submit">
          <FiSearch size="16px" />
        </FormBtn>
        <InputSearch
          onChange={this.handelInput}
          placeholder="What do you want to write?"
          name="search"
          required
          value={query}
          autoFocus
        />
      </SearchFormStyled>
    );
  }
}
