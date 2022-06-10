import { render, cleanup, screen } from '@testing-library/react';
import { expect } from 'chai';

import { HelloWorld } from '..';

describe('EditableFieldTemplate component', () => {
  function renderComponent() {
    return render(
      <HelloWorld />
    );
  }

  afterEach(cleanup);

  it('should pass', () => {
    renderComponent();
    expect(screen.getByText('Hello World')).to.be.visible;
  });
});
