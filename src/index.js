import {
  Animated,
  Dimensions,
  FlatList,
  StatusBar,
  SafeAreaView,
  ViewPropTypes,
  Text,
} from 'react-native';

import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Pagination from './Pagination';
import Dot from './Dot';
import SkipButton from './buttons/SkipButton';
import NextButton from './buttons/NextButton';
import DoneButton from './buttons/DoneButton';

// hotfix: https://github.com/facebook/react-native/issues/16710
const itemVisibleHotfix = { itemVisiblePercentThreshold: 100 };

export default class Onboarding extends Component {
  constructor() {
    super();

    this.state = {
      currentPage: 0,
      previousPage: null,
      width: null,
      height: null,
    };
  }

  onSwipePageChange = ({ viewableItems }) => {
    if (!viewableItems[0] || this.state.currentPage === viewableItems[0].index)
      return;

    this.setState(state => {
      this.props.pageIndexCallback &&
        this.props.pageIndexCallback(viewableItems[0].index);
      return {
        previousPage: state.currentPage,
        currentPage: viewableItems[0].index,
      };
    });
  };

  goNext = () => {
    this.flatList.scrollToIndex({
      animated: true,
      index: this.state.currentPage + 1,
    });
  };

  _onLayout = () => {
    const { width, height } = Dimensions.get('window');
    this.setState({ width, height });
  };

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item: Page }) => {
    return <Page />
  };

  render() {
    const {
      pages,
      bottomBarHeight,
      bottomBarColor,
      controlStatusBar,
      showSkip,
      showNext,
      showDone,
      showPagination,
      onSkip,
      onDone,
      skipLabel,
      nextLabel,
      allowFontScalingButtons,
      SkipButtonComponent,
      DoneButtonComponent,
      NextButtonComponent,
      DotComponent,
      flatlistProps,
      skipToPage,
      isLight
    } = this.props;
    const currentPage = pages[this.state.currentPage];
    const currentBackgroundColor = currentPage.backgroundColor;
    const barStyle = isLight ? 'dark-content' : 'light-content';
    const bottomBarHighlight = this.props.bottomBarHighlight;

    const skipFun =
      skipToPage != null
        ? () => {
          this.flatList.scrollToIndex({
            animated: true,
            index: skipToPage,
          });
        }
        : onSkip;

    return (
      <Animated.View
        onLayout={this._onLayout}
        style={{ flex: 1, backgroundColor: currentBackgroundColor, justifyContent: 'center' }}
      >
        {controlStatusBar && <StatusBar barStyle={barStyle} />}
        <FlatList
          ref={list => {
            this.flatList = list;
          }}
          data={pages}
          pagingEnabled
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
          onViewableItemsChanged={this.onSwipePageChange}
          viewabilityConfig={itemVisibleHotfix}
          initialNumToRender={1}
          extraData={
            this.state.width // ensure that the list re-renders on orientation change
          }
          {...flatlistProps}
        />
        {showPagination && (
          <SafeAreaView style={bottomBarHighlight ? styles.overlay : {}}>
            <Pagination
              isLight={isLight}
              bottomBarHeight={bottomBarHeight}
              bottomBarColor={bottomBarColor}
              showSkip={showSkip}
              showNext={showNext}
              showDone={showDone}
              numPages={pages.length}
              currentPage={this.state.currentPage}
              controlStatusBar={controlStatusBar}
              onSkip={skipFun}
              onDone={onDone}
              onNext={this.goNext}
              skipLabel={skipLabel}
              nextLabel={nextLabel}
              allowFontScaling={allowFontScalingButtons}
              SkipButtonComponent={SkipButtonComponent}
              DoneButtonComponent={DoneButtonComponent}
              NextButtonComponent={NextButtonComponent}
              DotComponent={DotComponent}
            />
          </SafeAreaView>
        )}
      </Animated.View>
    );
  }
}

Onboarding.propTypes = {
  pages: PropTypes.arrayOf(
    PropTypes.elementType
  ).isRequired,
  bottomBarHighlight: PropTypes.bool,
  bottomBarHeight: PropTypes.number,
  bottomBarColor: PropTypes.string,
  controlStatusBar: PropTypes.bool,
  showSkip: PropTypes.bool,
  showNext: PropTypes.bool,
  showDone: PropTypes.bool,
  showPagination: PropTypes.bool,
  isLight: PropTypes.bool,
  onSkip: PropTypes.func,
  onDone: PropTypes.func,
  skipLabel: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  nextLabel: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  SkipButtonComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  DoneButtonComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  NextButtonComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  DotComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  containerStyles: ViewPropTypes.style,
  imageContainerStyles: ViewPropTypes.style,
  allowFontScalingText: PropTypes.bool,
  allowFontScalingButtons: PropTypes.bool,
  titleStyles: Text.propTypes.style,
  subTitleStyles: Text.propTypes.style,
  transitionAnimationDuration: PropTypes.number,
  skipToPage: PropTypes.number,
  pageIndexCallback: PropTypes.func,
};

Onboarding.defaultProps = {
  bottomBarHighlight: true,
  bottomBarHeight: 60,
  bottomBarColor: 'transparent',
  controlStatusBar: true,
  showPagination: true,
  isLight: true,
  showSkip: true,
  showNext: true,
  showDone: true,
  skipLabel: 'Skip',
  nextLabel: 'Next',
  onSkip: null,
  onDone: null,
  SkipButtonComponent: SkipButton,
  DoneButtonComponent: DoneButton,
  NextButtonComponent: NextButton,
  DotComponent: Dot,
  containerStyles: null,
  imageContainerStyles: null,
  allowFontScalingText: true,
  allowFontScalingButtons: true,
  titleStyles: null,
  subTitleStyles: null,
  transitionAnimationDuration: 500,
  skipToPage: null,
  pageIndexCallback: null,
};

const styles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
};
