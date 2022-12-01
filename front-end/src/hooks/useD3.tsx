import React from 'react';
import * as d3 from 'd3';

export function useD3(renderChartFn: (svg: d3.Selection<SVGSVGElement | null, unknown, null, undefined>) => any, dependencies: any[]): React.Ref<SVGSVGElement> | undefined {
    const ref = React.useRef<SVGSVGElement>(null);

    React.useEffect(() => {
        renderChartFn(d3.select(ref.current));
        return () => {};
      }, dependencies);
    return ref;
}