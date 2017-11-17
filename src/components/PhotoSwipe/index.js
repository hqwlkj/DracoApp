import React from 'react';
import PropTypes from 'prop-types';
import {PhotoSwipeGallery, PhotoSwipe} from 'react-photoswiper';

let id = parseInt(Date.now() + '' + (Math.floor(Math.random() * 100000000000000000 % 100000000)));
class PhotoSwipeComponent extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      id: 'pswp' + id,
      items: [],
      options: {
        closeOnScroll: false
      }
    }
  }

  componentWillMount() {
    let options = this.props.options;
    options.mainClass = 'pswp--minimal--dark';
    options.barsSize = {top: 0, bottom: 0};
    options.captionEl = false;
    options.fullscreenEl = false;
    options.shareEl = false;
    options.bgOpacity = 0.85;
    options.tapToClose = false;
    options.tapToToggleControls = false;
    options.showAnimationDuration = 0;
    this.setState({
      options: options
    });
  }

  componentDidMount() {
    console.log('componentDidMount');
    // debugger;
    if (this.state.items.length > 0) {
      this.setState({items:this.state.items});
      return;
    }
    if (!!this.props.gallerySelector) {
      //选择所有图库元素
      // let galleryElements = document.querySelectorAll(this.props.gallerySelector);
      let galleryElements = document.querySelectorAll('#root');
      // let galleryElements = document.querySelectorAll('[class^="course-details-content"]');
      console.log('galleryElements',galleryElements);
      if (galleryElements.length > 0) {
        let imgs = galleryElements[0].getElementsByTagName('img');
        for (let i = 0, l = imgs.length; i < l; i++) {
          imgs[i].setAttribute('data-pswp-uid', i + 1);
          imgs[i].onclick = this.onThumbnailsClick.bind(this);
        }
      }
    }
  }

  closest = (el, fn) => {
    return el && ( fn(el) ? el : this.closest(el.parentNode, fn) );
  };

  onThumbnailsClick = (e) => {
    e = e || window.event;
    e.preventDefault ? e.preventDefault() : e.returnValue = false;
    let eTarget = e.target || e.srcElement;
    let clickedListItem = this.closest(eTarget, function (el) {
      return el.tagName === 'DIV';
    });
    let options = this.state.options;
    options.index = parseInt(eTarget.getAttribute('data-pswp-uid'));
    console.log('options',options);
    let items = this.parseThumbnailElements(clickedListItem);
    console.log('items',items);
    this.setState({items, options});
  };

  parseThumbnailElements = (ele) => {
    let thumbElements = ele.getElementsByTagName('img'),
      numNodes = thumbElements.length,
      items = [],
      el,
      item = {};

    for (let i = 0; i < numNodes; i++) {
      el = thumbElements[i];
      if (el.nodeType !== 1) {
        continue;
      }

      item = {
        src: el.src,
        w: el.width * 2,
        h: el.height * 2,
        title: el.getAttribute('alt') || el.getAttribute('title') || ''
      }

      items.push(item);
    }
    return items;
  };

  handleClose = () => {
    this.props.handleClose();
  };

  handleBeforeChange = (instance, change) => {
    console.log('Before change: ', change);
  };

  getRenderContent(){
    const {isOpen} = this.props;
    if(this.state.items.length > 0){
      return (<PhotoSwipe
        id={this.state.id}
        isOpen={isOpen}
        items={this.state.items}
        options={this.state.options}
        beforeChange={this.handleBeforeChange}
        onClose={this.handleClose}
      />);
    }
    return null;
  }

  render() {
    const {isOpen} = this.props;
    return (this.getRenderContent());
  }
}


PhotoSwipeComponent.propTypes = {
  isOpen: PropTypes.bool,
  items: PropTypes.array
};
PhotoSwipeComponent.defaultProps = {
  isOpen: false,
  items: []
};
export default PhotoSwipeComponent;
