using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AjusteEstadosProfesor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Titulo",
                table: "Propiedades",
                newName: "Nombre");

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaReserva",
                table: "Reservas",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaRegistro",
                table: "Propiedades",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FechaReserva",
                table: "Reservas");

            migrationBuilder.DropColumn(
                name: "FechaRegistro",
                table: "Propiedades");

            migrationBuilder.RenameColumn(
                name: "Nombre",
                table: "Propiedades",
                newName: "Titulo");
        }
    }
}
