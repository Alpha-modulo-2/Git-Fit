import ReactApexChart from 'react-apexcharts';
import React from 'react';

interface HistoryProps {
    dates: string[];
    tasks: number[];
    meals: number[];
    weight: number[];
}

interface State {
    series: any[];
    options: any;
    seriesLine: any[];
    optionsLine: any;
}

interface ApexChartProps {
    history: HistoryProps;
}

class ApexChart extends React.Component<ApexChartProps, State> {
    constructor(props: ApexChartProps) {
        super(props);

        const { dates, tasks, meals, weight } = props.history;
    
        this.state = {
            series: [{
                name: 'Peso',
                data: weight,
            }, {
                name: 'Treinos',
                data: tasks,
            }, {
                name: 'Refeições',
                data: meals,
            }],
            options: {
                chart: {
                    id: 'chart2',
                    type: 'line',
                    height: 200,
                    toolbar: {
                        autoSelected: 'pan',
                        show: false
                    }
                },
                title: {
                    text: 'Histórico',
                    align: 'center',
                    style: {
                        fontSize: "18px",
                        color: '#000000',
                        fontFamily: '"Poppins", sans-serif'
                    }
                },
                xaxis: {
                    type: 'datetime',
                    categories: dates,
                    labels: {
                        datetimeFormatter: {
                            year: 'yyyy',
                            month: 'MMM \'yy',
                            day: 'dd MMM',
                        }
                    },
                },
                tooltip: {
                    y: {
                        formatter: function (value: number, { seriesIndex }: { seriesIndex: number }) {
                            if (seriesIndex === 0) return `${value} kg`;
                            return `${value} %`;
                        },
                    }
                },
            },
            seriesLine: [{
                    name: 'Peso',
                    data: weight
                }, {
                    name: 'Treinos',
                    data: tasks
                }, {
                    name: 'Refeições',
                    data: meals
                }],
            optionsLine: {
                chart: {
                    id: 'chart1',
                    height: 80,
                    type: 'area',
                    brush: {
                        target: 'chart2',
                        enabled: true
                    },
                    selection: {
                        enabled: true,
                        xaxis: {
                            min: dates[0],
                            max: dates[1]
                        }
                    },
                },
                title: {
                    text: 'Timeline - Selecione um período:',
                    align: 'center',
                    style: {
                        fontSize: "12px",
                        color: '#666',
                        fontFamily: '"Poppins", sans-serif'
                    }
                },
                xaxis: {
                    type: 'datetime',
                    categories: dates,
                },
                yaxis: {
                    labels: {
                        show: false
                    }
                },
            },
        };
    }

    render() {
        return (
            <div id="wrapper">
                <div id="chart-line2">
                    <ReactApexChart options={this.state.options} series={this.state.series} type="line" height={280} />
                </div>
                <div id="chart-line">
                    <ReactApexChart options={this.state.optionsLine} series={this.state.seriesLine} type="area" height={150} />
                </div>
            </div>
        );
    }
}

export default ApexChart;