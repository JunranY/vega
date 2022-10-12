import {PreFacet, Sieve} from '../../transforms';

export default function(spec, scope, input) {
  const op = scope.add(PreFacet({pulse: input.pulse}), "subflow"),
        subscope = scope.fork();

  subscope.add(Sieve(), "subflow");
  subscope.addSignal('parent', null);

  // parse group mark subflow
  op.params.subflow = {
    $subflow: subscope.parse(spec).toRuntime()
  };
}
