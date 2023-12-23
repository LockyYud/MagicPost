import Card from "./card";
import Chart from 'react-apexcharts';
import { Button } from 'react-bootstrap';

const data = {
    series: [{
        name: 'Hàng gửi',
        data: [55, 75, 22, 35, 50, 65, 90]
    }, {
        name: 'Hàng nhận',
        data: [30, 60, 45, 20, 70, 55, 40]
    }],
};


const options = {
    chart: {
        width: 380,
        type: 'area',
        parentHeightOffset: 0,
        toolbar: { show: false }
    },
    dataLabels: { enabled: false },
    states: {
        hover: {
            filter: { type: 'none' }
        },
        active: {
            filter: { type: 'none' }
        }
    },
    colors: ['#f76c9e'],
    legend: { show: false },
    xaxis: {
        categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        tickPlacement: 'on',
        labels: { show: false },
        axisTicks: { show: false },
        axisBorder: { show: false }
    },
    yaxis: {
        show: true,
        tickAmount: 4,
        labels: {
            offsetX: -17,
            formatter: value => `${value > 999 ? `${(value / 1000).toFixed(0)}k` : value}`
        }
    }

};

export default function TotalGood() {

    const data = {
        series: [{
            name: 'Tổng hàng hóa',
            data: [505, 705, 202, 350, 500, 650, 900]
        }],
    };


    return (
        <Card title={"Tổng hàng hóa"}>
            <Chart type='area' options={options} height={205} series={data.series} />
            <p>
                Your sales performance is 45% 😎 better compared to last month
            </p>
            <Button>Chi tiết</Button>
        </Card>
    );
}