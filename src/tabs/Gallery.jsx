import { Component } from 'react';

import * as ImageService from 'service/image-service';
import { Button, SearchForm, Grid, GridItem, Text, CardItem } from 'components';

export class Gallery extends Component {
  state = {
    query: '',
    images: [],
    page: 1,
    isLoading: false,
    isEmpty: false,
    isVisible: false,
    error: null,
  };

  componentDidUpdate(_, prevState) {
    const { query, page } = this.state;

    if (prevState.query !== query || prevState.page !== page) {
      this.getPhotos(query, page);
    }
  }

  getPhotos = async (query, page) => {
    if (!query) return;
    this.setState({ isLoading: true });
    try {
      const {
        photos,
        total_results,
        per_page,
        page: currentPage,
      } = await ImageService.getImages(query, page);

      if (photos.length === 0) {
        this.setState({ isEmpty: true });
      }
      this.setState(prevState => ({
        images: [...prevState.images, ...photos],
        isVisible: currentPage < Math.ceil(total_results / per_page),
      }));
    } catch (error) {
      this.setState({ error: error.message });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  onHandleSubmit = value => {
    this.setState({
      query: value,
      page: 1,
      images: [],
      error: null,
      isEmpty: false,
    });
  };

  onLoadMore = () => {
    this.setState(prev => ({ page: prev.page + 1 }));
  };

  render() {
    const { images, isLoading, isEmpty, isVisible, error } = this.state;
    return (
      <>
        <SearchForm onSubmit={this.onHandleSubmit} />
        {isEmpty && (
          <Text textAlign="center">Sorry. There are no images ... 😭</Text>
        )}
        {error && (
          <Text textAlign="center">❌ Something went wrong - {error}</Text>
        )}
        <Grid>
          {images.length > 0 &&
            images.map(({ alt, id, src, avg_color }) => (
              <GridItem key={id}>
                <CardItem color={avg_color}>
                  <img src={src.large} alt={alt} />
                </CardItem>
              </GridItem>
            ))}
        </Grid>
        {isVisible && (
          <Button onClick={this.onLoadMore} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Load More'}
          </Button>
        )}
      </>
    );
  }
}
