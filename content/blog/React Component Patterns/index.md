---
title: React Component Patterns
date: "2020-08-28T00:00:00.000Z"
description: "다양한 React패턴의 장단점과 각 패턴이 가장 적합한 때를 식별하는데 도움이 된다."
tags: ["개발", "React"]
---

# [8/27] React Component Patterns

# 개요

이 문서는 다양한 React 패턴의 장단점과 각 패턴이 가장 적합한 때를 식별하는 데 도움이 됩니다. 다음 패턴들은 관심사 분리, DRY, code reuse와 같은 설계 원칙을 준수하여 더 유용하고 재사용 가능한 코드를 허용합니다. 이 패턴들 중 일부는 대규모 React 어플리케이션에서 발생할 수 있는 prop drilling 또는 state관리와 같은 문제들을 해결하는 데 도움이 됩니다.

> 💡다음 각 컴포넌트 요소 패턴의 개념과 관련이 없는 구현 세부 정보와 읽는 이를 혼동하지 않도록 복잡하지 않습니다.

# Compound Components

## Overview

`Compound Component`는 컴포넌트가 함께 사용되어 백그라운드에서 서로 통신할 수 있는 암시적인 state를 공유하는 패턴입니다. `Compound Component`는 모든 기능이 함께 작용하는 자식 컴포넌트들의 부분집합으로 이루어져 있습니다.

> html의 `<select>`와 `<option>` 같은 Compound Component를 생각해 봅시다. 별개로 그것들은 너무 많이 하지 않지만, 그것들은 함께 여러분이 완전한 경험을 창조할 수 있도록 해 줍니다. — [Kent C. Dodds](https://kentcdodds.com/blog/advanced-react-component-patterns)

### ❓왜 `Compound Component`인가? 이것이 주는 가치는 무엇인가?

재사용 가능한 컴포넌트의 생성자로서, 당신은 컴포넌트의 사용자를 염두에 두어야 하는 것이: 다른 개발자는 당신의 컴포넌트를 사용할 것입니다. 이 패턴은 컴포넌트의 사용자에게 유연성을 제공합니다. 당신의 컴포넌트의 내부 작동을 추상화할 수 있습니다; '사용자가 관여할 필요가 없는 재사용 가능한 컴포넌트의 원리'. Compond Component는 재사용 가능한 전체론적 경험을 제공하면서 컴포넌트의 사용자가 결합 요소의 배치에만 신경을 쓰는 사용자 친화적인 인터페이스를 제공합니다.

## Example

예를 들어, 이미지와 함께하는 Radio form을 만들어 봅시다. 우리는 Radio Group form을 만들 것이지만, 일반적인 Radio button입력을 보여주는 대신에 사용자가 선택할 수 있는 이미지 목록을 렌더링할 것입니다. [CodeSandBox](https://codesandbox.io/s/compound-components-radio-image-form-k1h8x)의 최종 결과와 함께 따라할 수 있습니다.

```tsx
{
  /* 부모 컴포넌트는 onChange event를 핸들링하고
현재 선택된 value state를 관리합니다. */
}
;<RadioImageForm>
  {/* 자식, sub-component들입니다.
  각 sub-component들은 이미지로 표시되는 라디오 입력입니다. 사용자가 이미지를 클릭하여
값을 선택할 수 있습니다. */}
  <RadioImageForm.RadioInput />
  <RadioImageForm.RadioInput />
  <RadioImageForm.RadioInput />
</RadioImageForm>
```

`src/components/RadioImageForm.tsx`에 하나의 main component가 있습니다.

```tsx
// src/components/RadioImageForm.tsx
import * as React from "react"
import RadioImageFormWrapper from "./RadioImageFormWrapper"

interface Props {
  onStateChange?(e: string): void
  defaultValue?: string
}

interface State {
  currentValue: string
  onChange(e: React.ChangeEvent<HTMLInputElement>): void
}
/**
 * @name RadioImageForm
 * @author Alexi Taylor
 *
 * @desc RadioImageForm은 compound component 패턴을 사용합니다. 
 *  1. RadioImageForm - 전체 상태를 관리하는 상위 컴포넌트
 * 	2. RadioInput - 다음으로 유저는 'RadioInput' compound component로 라디오 입력을
 * 추가할 수 있습니다. RadioImageForm의 하위 컴포넌트입니다.
 * 'RadioInput'컴포넌트에서 우리는 상위 컴포넌트인 RadioImageForm이 onChange event Action
 * 을 다루고 현재 체크된 Radio Input을 업데이트하는 라디오 입력 요소의 구현 세부사항을 
 * 추상화하였습니다.
 * 
 * @props {(e: string): void;} [onStateChange] 
 * @props {string} [defaultValue]
 * 
 * @component RadioInput
 * @props {string} label
 * @props {string} value
 * @props {string} name
 * @props {string} imgSrc
 *
 * @example:
  <RadioImageForm onStateChange={onChange}>
		{DATA.map(
			({ label, value, name, imgSrc }): React.ReactElement => (
				<RadioImageForm.RadioInput
					label={label}
					value={value}
					name={label}
					imgSrc={imgSrc}
					key={imgSrc}
				/>
			),
		)}
	</RadioImageForm>
 * */

interface RadioInputProps {
  label: string
  value: string
  name: string
  imgSrc: string
  key: string | number
  currentValue?: string
  onChange?(e: React.ChangeEvent<HTMLInputElement>): void
}

class RadioImageForm extends React.Component<Props, State> {
  /**
   * static 키워드는 엔드유저가 RadioImageForm 클래스로부터
   * RadioImageForm 클래스의 프로퍼티로 참조할 수 있도록 만들어줍니다.
   * e.g. <RadioImageForm.RadioInput />
   * RadioInput은 static 프로퍼티이므로 RadioImageForm 인스턴스에 엑세스할 수 없습니다.
   * 따라서, RadioImageForm 클래스의 상태 또는 메서드를 참조할 수 없습니다.
   * e.g. `this.onChange` 은 다음 예에서 작동하지 않음:
   * static RadioInput = ({ onChange, //... }) => //... <input onChange={this.onChange} //...
   */
  static RadioInput = ({
    currentValue,
    onChange,
    label,
    value,
    name,
    imgSrc,
    key,
  }: RadioInputProps): React.ReactElement => (
    <label className="radio-button-group" key={key}>
      <input
        type="radio"
        name={name}
        value={value}
        aria-label={label}
        onChange={onChange}
        checked={currentValue === value}
        aria-checked={currentValue === value}
      />
      <img alt="" src={imgSrc} />
      <div className="overlay">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-check-circle"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      </div>
    </label>
  )

  onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value
    this.setState(
      {
        currentValue: value,
      },
      () => {
        // setState callback은 state가 바뀐 후에 할 작업을 정의할 수 있다.
        this.props.onStateChange && this.props.onStateChange(value)
      }
    )
  }

  state = {
    currentValue: "",
    onChange: this.onChange,
    defaultValue: this.props.defaultValue || "",
  }

  render(): React.ReactElement {
    /**
     *
     * 우리는 우리 컴포넌트의 사용자가 RadioImageForm 컴포넌트 내에서 원하는 컴포넌트를 렌더링
     * 할 수 있도록 하려고 합니다.
     * RadioInput 컴포넌트는 내부 상태, 내부 'onChange'함수, 사용자 props등이 제대로
     * 작동하도록 해야 할 것입니다.
     * 그러나 이 데이터를 하위 컴포넌트에 어떻게 전달해야 하는가?
     * 여기서 React.Children.map과 React.cloneElement가 등장합니다.
     * 이것을 하기 위해서 우리는:
     * 1. React.Children.map: https://reactjs.org/docs/react-api.html#reactchildrenmap
     * 2. React.cloneElement: https://reactjs.org/docs/react-api.html#cloneelement
     */
    const { currentValue, onChange, defaultValue } = this.state
    // 만약 하나의 자식만이 존재하는 경우, this.props.children은 배열이 아닌 요소를 포함할 것이므로,
    // 여기에 React.Children.map()을 사용하는것이 중요합니다.
    return (
      <RadioImageFormWrapper>
        <form>
          {// 그럼 여기서 우리는 이 모든 this.props.children을 가져가서 그 props들을 가지고 있는 복사본을 만들
          // 수 있을 것이다.
          React.Children.map(this.props.children, (child: React.ReactElement) =>
            // element를 시작점으로 사용하여 새로운 리액트 엘레먼트를 클론하고 리턴한다.
            // 결과 element는 새로운 props들이 섈로우하게 합쳐진 element의 props를 갖게 된다.
            // 새로운 children은 존재하는 children을 대신하게 될 것이다.
            React.cloneElement(child, {
              currentValue,
              onChange,
              defaultValue,
            })
          )}
        </form>
      </RadioImageFormWrapper>
    )
  }
}

export default RadioImageForm
```

1. `RadioImageForm` - 먼저 상태를 관리하고 form의 변경 이벤트를 처리할 상위 구성요소를 생성한다. 컴포넌트의 소비자, 즉 컴포넌트를 사용하는 다른 개발자는 콜백 함수 prop인 `onStateChange`를 전달함으로써 현재 선택된 라디오 입력 값을 구독할 수 있다. 각 form의 변화로, 컴포넌트는 라디오 입력의 업데이트를 핸들링하고 컨슈머에게 현재 값을 제공합니다.

`RadioImageForm`컴포넌트에는 다음 중 하나의 static 컴포넌트 또는 서브컴포넌트를 가집니다.

1. `RadioImageInput` - 다음으로, 우리는 `RadioImageForm` 컴포넌트의 부분집합 컴포넌트인 static 컴포넌트를 만들 것입니다. `RadioInput` 은 `<RadioImageForm.RadioInput/>`와 같은 dot-syntax 표기법을 통해 접근할 수 있는 static 컴포넌트입니다.

> 💡RadioInput 컴포넌트는 RadioImageForm 클래스의 static 프로퍼티이다. ㅌCompound component는 부모 컴포넌트인 RadioImageForm과 static 컴포넌트인 RadioInput으로 구성된다. 여기서부터 static component를 sub-components(자손 컴포넌트)로 부릅니다.

`RadioImageForm` 컴포넌트를 만드는 첫 번째 단계를 시작합시다.

```tsx
export class RadioImageForm extends React.Component<Props, State> {
	static RadioInput = ({
		currentValue,
		label,
		value,
		name,
		imgSrc,
		key,
	}: RadioInputProps): React.ReactElement => (
		// ...
	);

	onChange = (): void => {
		// ...
	}

	state = {
		currentValue: '',
		onChange: this.onChange,
		defaultValue: this.props.defaultValue || '',
	};

	render(): React.ReactElement {
		return (
			<RadioImageFormWrapper>
				<form>
				{/* .... */}
				</form>
			</RadioImageFormWrapper>
		)
	}
}
```

재사용 가능한 컴포넌트를 작성할 때, 우리는 소비자가 코드에서 요소가 렌더링되는 위치를 제어할 수 있는 컴포넌트를 제공하고자 합니다. 그러나 RadioInput 컴포넌트는 경험이 제대로 작동하려면 내부 state, 내부 onChange 함수 및 사용자의 props에 대한 엑세스가 필요할 것입니다. 그러나 이 데이터를 어떻게 하위 컴포넌트에게 전달해야 할까? 여기에서 "React.Children.map"과 "React.cloneElement"가 작동한다. 두 가지 작업 방법에 대한 자세한 설명은 다음 리액트 문서를 참조하십시오.

- [React.Children.map](https://reactjs.org/docs/react-api.html#reactchildrenmap)
- [React.cloneElement](https://reactjs.org/docs/react-api.html#cloneelement)

`RadioImageForm`의 최종 render 메소드 결과는 다음과 같을 것입니다.

```tsx
render(): React.ReactElement {
  const { currentValue, onChange, defaultValue } = this.state;

  return (
    <RadioImageFormWrapper>
      <form>
        {
          React.Children.map(this.props.children,
            (child: React.ReactElement) =>
              React.cloneElement(child, {
                currentValue,
                onChange,
                defaultValue,
              }),
          )
        }
      </form>
    </RadioImageFormWrapper>
  )
}
```

이 구현에서는 다음 사항에 유의하십시오.

1. `RadioImageFormWrapper` - styled-components 를 이용한 component 입니다. CSS 스타일은 컴포넌트 패턴과 관련이 없기 때문에 우리는 이것을 무시할 수 있습니다.
2. `React.Children.map` - 이것은 각 직속 자손을 관리할 수 있도록 하기 위해 컴포넌트의 직속 자손을 반복합니다.
3. `React.cloneElement` - 리액트 문서에 따르면:

   > element를 시작점으로 사용하여 새 React element를 복제하고 리턴합니다. 결과 element는 새로운 props들이 얕게 합쳐진 element의 props를 갖게 될 것입니다. 새로운 자손들이 기존 자손들을 대신하게 될 것입니다.

React.Children.map과 React.cloneElement와 함께라면 우리는 각 자손을 반복하고 조작할 수 있습니다. 그래서 우리는 이 변환 과정에서 명시적으로 정의한 추가 props를 전달할 수 있습니다. 이 경우, RadioImageForm내부 상태를 각 RadioInput 자손들에게 전달할 수 있습니다. React.cloneElement는 shallow 병합을 수행하므로 RadioInput에서 사용자가 정의한 모든 props는 컴포넌트로 전달됩니다.

마지막으로, 우리는 RadioImageForm 클래스에 RadioInput static 프로퍼티 컴포넌트를 선언할 수 있습니다. 이를 통해 소비자는 dot-syntax표기법을 사용하여 RadioImageForm에서 직접 우리의 자손 컴포넌트인 RadioInput을 호출할 수 있습니다. 이것은 가독성 향상에 도움을 주고 자손 컴포넌트 요소를 명시적으로 선언합니다. 우리는 이 인터페이스를 통해 재사용 가능하고 사용하기 편리한 컴포넌트를 만들었습니다. 다음은 RadioInput의 static 컴포넌트이다.

```tsx
static RadioInput = ({
	currentValue,
	onChange,
	label,
	value,
	name,
	imgSrc,
	key,
}: RadioInputProps) => (
	<label className="radio-button-group" key={key}>
		<input
			type="radio"
			name={name}
			value={value}
			aria-label={label}
			onChange={onChange}
			checked={currentValue === value}
			aria-checked={currentValue === value}
		/>
		<img alt="" src={imgSrc} />
		<div className="overlay">
			{/* ... */}
		</div>
	</label>
);
```

> 💡한 가지 유의할 점은 사용자가 RadioInput 서브컴포넌트에 전달할 수 있는 Props 모델 제약을 RadioInputProps에 명시적으로 정의했다는 점이다.

그리고 컴포넌트의 소비자는 그들의 코드에 dot-syntax로 `RadioInput`를 레퍼런싱할 수 있다. (`RadioImageForm.RadioInput`)

```tsx
// src/index.tsx
<RadioImageForm onStateChange={onChange}>
  {Data.map(
    ({ label, value, imgSrc }): React.ReactElement => (
      <RadioImageForm.RadioInput
        label={label}
        value={value}
        name={label}
        imgSrc={imgSrc}
        key={imgSrc}
      />
    )
  )}
</RadioImageForm>
```

> 🚧RadioInput이 static 프로퍼티이기 때문에, RadioImageForm의 인스턴스에 접근할 수 없다. 따라서 RadioImageForm클래스에 정의된 state나 메소드를 직접 참조할 수 없다. 예) `static RadioInput = () => <input onChange={this.onChange} //...`

## Conclusion

이러한 유연한 철학으로, 우리는 라디오 이미지 폼의 구현 세부사항을 추상화했습니다. 우리 컴포넌트의 내부 로직처럼, 보다 복잡한 컴포넌트로 우리는 사용자로부터 내부 작업을 추상화할 수 있습니다. 상위 컴포넌트인 RadioImageForm은 onChange 이벤트 액션과 현제 체크된 라디오 입력을 업데이트합니다. 그리고 RadioInput 자손들은 현재 선택된 입력을 결정할 수 있습니다. 우리는 라디오 이미지 폼의 기본 스타일링을 제공하였습니다. 추가 보너스는 우리가 컴포넌트에 대한 접근성도 포함했다는 것이다. 폼 상태 관리, 현재 체크된 라디오 입력 적용 및 폼 스타일 적용에 대한 RadioImageForm 컴포넌트의 내부 로직은 우리 컴포넌트를 사용하는 개발자와 관련이 없는 구현 세부 사항이다.

## Drawbacks

While we have created user-friendly interface for users of our components, there is a hole within our design. What if the `<RadioImageForm.RadioInput/>` is buried in a bunch of divs? What happens if the consumer of the component wants to re-arrange the layout? The component will still render, but the radio input will not receive the current value from `RadioImageForm` state, hence breaking our user experience. This component pattern is not flexible, which brings us to our next component pattern.

## CodeSandBox

# Flexible Compound Components

## Overview

## Example

## Conclusion

## CodeSandBox

# Provider Pattern

## Overview

## Example

## Conclusion

## CodeSandBox

[⚛️ 🚀 React Component Patterns](https://dev.to/alexi_be3/react-component-patterns-49ho#compound-components)
