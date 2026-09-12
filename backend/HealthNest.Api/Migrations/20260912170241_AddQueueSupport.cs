using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HealthNest.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddQueueSupport : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "CheckedIn",
                table: "Appointments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "CheckedInAt",
                table: "Appointments",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CheckedIn",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "CheckedInAt",
                table: "Appointments");
        }
    }
}
