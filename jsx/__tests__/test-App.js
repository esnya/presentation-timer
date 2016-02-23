jest.dontMock('../App');

import React from 'react';
import {renderIntoDocument} from 'react-addons-test-utils';
import {App} from '../App';

describe('test', () => {
    it('should be able to render', () => {
        renderIntoDocument(<App />);
    });
});