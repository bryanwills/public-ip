import sinon from 'sinon';

export default function stub(objectPath, propertyName, ignoreIndex) {
	let ignoreRegExp;
	let ignored = [];

	const original = objectPath[propertyName];

	function stub(...arguments_) {
		if (ignoreIndex !== undefined) {
			const ignoreArgument = arguments_.slice(ignoreIndex, ignoreIndex + 1)[0];
			if (ignoreRegExp && ignoreRegExp.test(ignoreArgument)) {
				ignored.push(ignoreArgument);
				throw new Error('Ignored by mock');
			}
		}

		return original.bind(this)(...arguments_);
	}

	sinon.stub(objectPath, propertyName).callsFake(stub);

	return {
		ignore(_ignoreRegExp) {
			ignoreRegExp = _ignoreRegExp;
		},
		ignored: () => ignored.length,
		called: () => objectPath[propertyName].callCount,
		restore() {
			ignoreRegExp = undefined;
			ignored = [];
			objectPath[propertyName].resetHistory();
		},
	};
}
