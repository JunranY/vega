import parseUpdate from './update';
import {parseExpression} from 'vega-functions';
import {error} from 'vega-util';

export default function(signal, scope) {
  if (signal.id) {
    // console.log(`calling ${signal.id}`)
    if(!scope.trace[signal.id]) scope.trace[signal.id] = []
    scope.curr = scope.trace[signal.id]
  }
  const op = scope.getSignal(signal.name);
  let expr = signal.update;

  if (signal.init) {
    if (expr) {
      error('Signals can not include both init and update expressions.');
    } else {
      expr = signal.init;
      op.initonly = true;
    }
  }

  if (expr) {
    expr = parseExpression(expr, scope);
    op.update = expr.$expr;
    op.params = expr.$params;
  }

  if (signal.on) {
    signal.on.forEach(_ => parseUpdate(_, scope, op.id));
  }
}
