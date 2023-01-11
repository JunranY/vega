import parseSignalUpdates from './signal-updates';
import {initScale, parseScale} from './scale';
import parseProjection from './projection';
import parseLegend from './legend';
import parseSignal from './signal';
import parseTitle from './title';
import parseData from './data';
import parseMark from './mark';
import parseAxis from './axis';
import {array} from 'vega-util';

export default function(spec, scope, preprocessed) {
  const signals = array(spec.signals),
        scales = array(spec.scales);

  // parse signal definitions, if not already preprocessed
  if (!preprocessed) signals.forEach(_ => parseSignal(_, scope));

  // parse cartographic projection definitions
  array(spec.projections).forEach(_ => parseProjection(_, scope));

  // initialize scale references
  scales.forEach(_ => initScale(_, scope));

  // parse data sources
  array(spec.data).forEach(_ => parseData(_, scope));

  // parse scale definitions
  scales.forEach(_ => parseScale(_, scope));

  // parse signal updates
  (preprocessed || signals).forEach(_ => parseSignalUpdates(_, scope));

  // parse axis definitions
  array(spec.axes).forEach(_ => parseAxis(_, scope));

  // parse mark definitions
  array(spec.marks).forEach(_ => parseMark(_, scope));

  // parse legend definitions
  array(spec.legends).forEach(_ => parseLegend(_, scope));

  // parse title, if defined
  if (spec.title) parseTitle(spec.title, scope);

  // parse collected lambda (anonymous) expressions
  scope.parseLambdas();

  return scope;
}
// obj[propName] = (function(fnName) {
//   return function() {
//       beforeFn.call(this, fnName, arguments);
//       return prop.apply(this, arguments);
//   }
// })(propName);

// parseAxis = (function(fnName) {
//   return function() {
//     beforeFn.call(this, fnName, arguments);
//     return prop.apply(this, arguments);
//   }
// })

// var addFnCounter = function(target){
//   var swap = target;
//   var count = 0;
//   return function(){
//       swap.apply(null, arguments);
//       count++;
//       console.log("func has been called " + count + " times");
//       console.log("\n");
//   };
// };

// var parseAxisMod = eval(parseAxis.toString())
// parseAxisMod = addFnCounter(parseAxisMod)

// function inject(obj, beforeFn) {
//   for (let propName of Object.getOwnPropertyNames(obj)) {
//       let prop = obj[propName];
//       if (Object.prototype.toString.call(prop) === '[object Function]') {
//           obj[propName] = (function(fnName) {
//               return function() {
//                   beforeFn.call(this, fnName, arguments);
//                   return prop.apply(this, arguments);
//               }
//           })(propName);
//       }
//   }
// }

// function logFnCall(name, args) {
//   let s = name + '(';
//   for (let i = 0; i < args.length; i++) {
//       if (i > 0)
//           s += ', ';
//       s += String(args[i]);
//   }
//   s += ')';
//   console.log(s);
// }

// inject(parseAxis.prototype, logFnCall);