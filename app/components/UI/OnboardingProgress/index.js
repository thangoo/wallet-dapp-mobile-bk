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
      separatorFinishedColor: colors['tvn.primary.default'],
      separatorUnFinishedColor: colors['tvn.text.muted'],
      currentStepStrokeWidth: strokeWidth,
      stepStrokeCurrentColor: colors['tvn.primary.default'],
      stepStrokeWidth: strokeWidth,
      stepStrokeFinishedColor: colors['tvn.primary.default'],
      stepStrokeUnFinishedColor: colors['tvn.text.muted'],
      stepIndicatorFinishedColor: colors['tvn.background.default'],
      stepIndicatorUnFinishedColor: colors['tvn.background.default'],
      stepIndicatorCurrentColor: colors['tvn.primary.default'],
      stepIndicatorLabelFontSize: 13,
      currentStepIndicatorLabelFontSize: 13,
      stepIndicatorLabelCurrentColor: colors['tvn.text.muted'],
      stepIndicatorLabelFinishedColor: colors.primary.inverse,
      stepIndicatorLabelUnFinishedColor: colors['tvn.text.muted'],
      labelColor: colors['tvn.text.muted'],
      stepIndicatorLabelFontFamily: fontStyles.normal.fontFamily,
      labelFontFamily: fontStyles.normal.fontFamily,
      labelSize: 10,
      currentStepLabelColor: colors['tvn.primary.default'],
      finishedStepLabelColor: colors['tvn.primary.default'],
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
