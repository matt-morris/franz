import { mdiEye, mdiEyeOff } from '@mdi/js';
import Icon from '@mdi/react';
import classnames from 'classnames';
import { observer } from 'mobx-react';
import React, { Component, createRef } from 'react';
import injectSheet from 'react-jss';

import { IFormField, IWithStyle } from '../typings/generic';

import Error from '../error';
import Label from '../label';
import Wrapper from '../wrapper';
import scorePasswordFunc from './scorePassword';

import styles from './styles';

interface IProps extends React.InputHTMLAttributes<HTMLInputElement>, IFormField, IWithStyle {
  focus?: boolean;
  prefix?: string;
  suffix?: string;
  scorePassword?: boolean;
  showPasswordToggle?: boolean;
}

interface IState {
  showPassword: boolean;
  passwordScore: number;
}

@observer
class InputComponent extends Component<IProps, IState> {
  public static defaultProps = {
    focus: false,
    onChange: () => {},
    onBlur: () => {},
    scorePassword: false,
    showLabel: true,
    showPasswordToggle: false,
    type: 'text',
    disabled: false,
  };

  state = {
    passwordScore: 0,
    showPassword: false,
  };

  private inputRef = createRef<HTMLInputElement>();

  componentDidMount() {
    const { focus } = this.props;

    if (focus && this.inputRef && this.inputRef.current) {
      this.inputRef.current.focus();
    }
  }

  onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const {
      scorePassword,
      onChange,
    } = this.props;

    if (onChange) {
      onChange(e);
    }

    if (this.inputRef && this.inputRef.current && scorePassword) {
      this.setState({ passwordScore: scorePasswordFunc(this.inputRef.current.value) });
    }
  }

  render() {
    const {
      classes,
      className,
      disabled,
      error,
      id,
      label,
      prefix,
      scorePassword,
      suffix,
      showLabel,
      showPasswordToggle,
      type,
      value,
      name,
      placeholder,
      spellCheck,
      onBlur,
    } = this.props;

    const {
      showPassword,
      passwordScore,
    } = this.state;

    const inputType = type === 'password' && showPassword ? 'text' : type;

    return (
      <Wrapper>
        <Label
          title={label}
          showLabel={showLabel}
          htmlFor={id}
          className={className}
        >
          <div
            className={classnames({
              [`${classes.hasPasswordScore}`]: scorePassword,
              [`${classes.wrapper}`]: true,
              [`${classes.disabled}`]: disabled,
              [`${classes.hasError}`]: error,
            })}>
            {prefix && (
              <span className={classes.prefix}>
                {prefix}
              </span>
            )}
            <input
              id={id}
              type={inputType}
              name={name}
              value={value}
              placeholder={placeholder}
              spellCheck={spellCheck}
              className={classes.input}
              ref={this.inputRef}
              onChange={this.onChange.bind(this)}
              onBlur={onBlur}
            />
            {suffix && (
              <span className={classes.suffix}>
                {suffix}
              </span>
            )}
            {showPasswordToggle && (
              <button
                type="button"
                className={classes.formModifier}
                onClick={() => this.setState(prevState => ({ showPassword: !prevState.showPassword }))}
                tabIndex={-1}
              >
                <Icon
                  path={!showPassword ? mdiEye : mdiEyeOff}
                  size={1}
                />
              </button>
            )}
          </div>
          {scorePassword && (
            <div className={classnames({
              [`${classes.passwordScore}`]: true,
              [`${classes.hasError}`]: error,
            })}>
              <meter
                value={passwordScore < 5 ? 5 : passwordScore}
                low={30}
                high={75}
                optimum={100}
                max={100}
              />
            </div>
          )}
        </Label>
        {error && (
          <Error message={error} />
        )}
      </Wrapper>
    );
  }
}

export const Input = injectSheet(styles)(InputComponent);
