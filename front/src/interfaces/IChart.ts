export interface SeriesType {
    name: string;
    data: number[];
}

export interface XaxisOptions {
    type: 'datetime';
    categories: string[];
    labels?: {
        datetimeFormatter?: {
            year: string;
            month: string;
            day: string;
        };
    };
}

export interface YaxisOptions {
    labels?: {
        show: boolean;
    };
}

export interface TooltipOptions {
    y?: {
        formatter: (value: number, options: { seriesIndex: number }) => string;
    };
}

export interface TitleOptions {
    text: string;
    align: 'center';
    style: {
        fontSize: string;
        color: string;
        fontFamily: string;
    };
}

export interface OptionsType {
    chart: any;
    title?: TitleOptions;
    xaxis?: XaxisOptions;
    yaxis?: YaxisOptions;
    tooltip?: TooltipOptions;
}

export interface State {
    series: SeriesType[];
    options: OptionsType;
    seriesLine: SeriesType[];
    optionsLine: OptionsType;
}

export interface ApexChartProps {
    summary: SummaryProps;
}

export interface SummaryProps {
    dates: string[];
    tasks: number[];
    meals: number[];
    weight: number[];
}