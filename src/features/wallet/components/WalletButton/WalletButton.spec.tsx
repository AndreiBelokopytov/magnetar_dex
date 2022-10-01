import { render, screen } from "@testing-library/react";
import { container } from "tsyringe";
import { WalletStore } from "../../stores";
import { WalletButton } from "./WalletButton";

const ETH_ADDRESS = "0xDAFEA492D9c6733ae3d56b7Ed1ADB60692c98Bc5";

describe("AccountButton", () => {
  let walletStore: WalletStore;

  beforeAll(() => {
    walletStore = container.resolve(WalletStore);
  });

  it("renders connect button if account is not set", () => {
    render(<WalletButton />);
    expect(
      screen.queryByRole("button", { name: "Connect" })
    ).toBeInTheDocument();
  });

  it("displays current address if account is set", () => {
    walletStore.setAddress(ETH_ADDRESS);
    render(<WalletButton />);
    expect(screen.queryByText(/^0x.+/)).toBeInTheDocument();
  });
});
