import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { fontStyles } from '../../../styles/common';
import StepIndicator from 'react-native-step-indicator';
import { ThemeContext, mockTheme } from '../../../util/theme';

const strokeWidth = 1;

export default class OnboardingProgress extends PureComponent {
  static defaultProps = {
    currentStep: 0,
  };

  static propTypes = {
    /**
     * int specifying the currently selected step
     */
    currentStep: PropTypes.number,
    /**
     * array of text strings representing each step
     */
    steps: PropTypes.array.isRequired,
  };

  render() {
    const { currentStep, steps } = this.props;
    const colors = this.context.colors || mockTheme.colors;
    const customStyles = {
      stepIndicatorSize: 30,
      currentStepIndicatorSize: 30,
      separatorStrokeWidth: strokeWidth,
      separatorFinishedColor: colors['tvn.blue'],
      separatorUnFinishedColor: colors['tvn.grayLight'],
      currentStepStrokeWidth: strokeWidth,
      stepStrokeCurrentColor: colors['tvn.blue'],
      stepStrokeWidth: strokeWidth,
      stepStrokeFinishedColor: colors['tvn.blue'],
      stepStrokeUnFinishedColor: colors['tvn.white'],
      stepIndicatorFinishedColor: colors['tvn.black'],
      stepIndicatorUnFinishedColor: colors['tvn.black'],
      stepIndicatorCurrentColor: colors['tvn.blue'],
      stepIndicatorLabelFontSize: 13,
      currentStepIndicatorLabelFontSize: 13,
      stepIndicatorLabelCurrentColor: colors.text.default,
      stepIndicatorLabelFinishedColor: colors.primary.inverse,
      stepIndicatorLabelUnFinishedColor: colors.text.muted,
      labelColor: colors['tvn.white'],
      stepIndicatorLabelFontFamily: fontStyles.normal.fontFamily,
      labelFontFamily: fontStyles.normal.fontFamily,
      labelSize: 10,
      currentStepLabelColor: colors['tvn.blue'],
      finishedStepLabelColor: colors['tvn.blue'],
    };

    return (
      <StepIndicator
        customStyles={customStyles}
        currentPosition={currentStep}
        labels={steps}
        stepCount={steps.length}
      />
    );
  }
}

OnboardingProgress.contextType = ThemeContext;
