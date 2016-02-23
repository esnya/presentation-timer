describe('actions', () => {
    const fs = require('fs');
    const path = require('path');

    const allActions = fs.readdirSync(path.join(__dirname, '..'))
        .map((file) => file.match(/^(.*)\.js$/))
        .filter((m) => m)
        .map((m) => m[1]);

    allActions.forEach((name) => jest.dontMock(`../${name}`));

    allActions.forEach((name) => {
        describe(name, () => {
            const Actions = require(`../${name}`);

            it('has actions which has value of string <ACTION>_UNDER_SCORE', () => {
                Object.keys(Actions)
                    .filter((key) => key.match(/^[A-Z0-9_]*$/))
                    .forEach((key) => {
                        const Action = Actions[key];
                        expect(Action.indexOf(name.toUpperCase())).toBe(0);
                        expect(Action).toMatch(/^[A-Z0-9][A-Z0-9_]*[A-Z0-9]$/);
                    });
            });

            it('has action creators which returns action', () => {
                Object.keys(Actions)
                    .filter((key) => key.match(/^[a-z][a-zA-Z0-9]$/))
                    .forEach((key) => {
                        const creator = Actions[key];
                        const action = creator({}, {}, {});
                        expect(typeof(action.type)).toBe('string');
                        expect(action.type.indexOf(name.toUpperCase())).toBe(0);
                    });
            });
        });
    });

    const counter = allActions.map((name) => {
            const Actions = require(`../${name}`);

            return Object.keys(Actions)
                .filter((key) => key.match(/^[A-Z0-9_]*$/))
                .map((key) => Actions[key]);
        })
        .reduce((result, actions) => result.concat(actions), [])
        .reduce((result, action) => {
            result[action] = (result[action] || 0) + 1;
            return result;
        }, {});

    Object.keys(counter)
        .forEach((key) => {
            describe(key, () => {
                it('is unique', () => {
                    expect(counter[key]).toBe(1);
                });
            });
        });
});