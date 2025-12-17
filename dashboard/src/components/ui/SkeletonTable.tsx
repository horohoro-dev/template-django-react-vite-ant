import { Skeleton, Table } from "antd";
import type { ColumnsType } from "antd/es/table";

type SkeletonTableProps = {
  columns: number;
  rows?: number;
};

export const SkeletonTable: React.FC<SkeletonTableProps> = ({
  columns,
  rows = 5,
}) => {
  const skeletonColumns: ColumnsType<{ key: number }> = Array.from(
    { length: columns },
    (_, index) => ({
      title: <Skeleton.Input active size="small" style={{ width: 80 }} />,
      dataIndex: `col${index}`,
      key: `col${index}`,
      render: () => (
        <Skeleton.Input active size="small" style={{ width: "100%" }} />
      ),
    }),
  );

  const skeletonData = Array.from({ length: rows }, (_, index) => ({
    key: index,
  }));

  return (
    <Table
      columns={skeletonColumns}
      dataSource={skeletonData}
      pagination={false}
    />
  );
};
