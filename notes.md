## JSX file structure

```tsx

--------------------
                    |
  // import section |
                    |
--------------------

------------------------
  // actual component

class Component extends React.Component {
  // ...

  // to parse this kind of component we want to grab
  // the content inside of the return value
  render() {
    return (
      {/* stuff we care about */}
      <div>
        some content
      </div>
      {/* stuff we care about */}
    )
  }
}

// OR

export const Component: React.FC<Props> = ({...}) => {

  // we also want to grab stuff inside of the return statement
  // but the problem is that it's not guaranteed that everyone
  // follows the 'best practices' like wrapping chunks of jsx
  // inside of parentheses...
  return (
    <div>
      some content
    </div>
  )
}

------------------------


```
